import { prisma } from '@/lib/prisma'; // Import the client we just created
import { NextResponse } from 'next/server';
import { ForbiddenError, NotFoundError, BadRequestError, UnauthenticatedError} from '@/errors/errors';
import { handleApiError } from '@/lib/api-error-handler';
import { validateBody } from '@/lib/middlewares/validate';
import { updateJobPostSchema } from "@/lib/validators/validators_config"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// edit job post data
export async function PUT(request, {params}) {
    try {

        const session = await getServerSession(authOptions)

        if (!session) {
            throw new UnauthenticatedError("Unauthorized! Please login!")
        }

        const user_id = parseInt(session.user_id)

        // get the id from the dynamic route
        const param_id = await params;
        // company_id type already validate in the /proxy.js
        const company_id = param_id.company_id
        const job_post_id = parseInt(param_id.job_post_id)

        if(!job_post_id) {
            throw BadRequestError(`Job Post id must be a number ${param_id.job_post_id}`)
        }

        // 1. Fetch Job Post to verify ownership and get info for the notification
        const job = await prisma.jobPost.findUnique({
            where: { job_post_id },
            include: { company: { select: { name: true } } }
        });

        if (!job || job.company_id !== parseInt(company_id)) {
            throw new NotFoundError("Job post not found in this company");
        }

        // 2. Check if the editor is a valid company member
        const isMember = await prisma.companyMember.findFirst({
            where: { company_id: parseInt(company_id), user_id, removed: false }
        });

        if (!isMember) throw new ForbiddenError("You don't have permission to edit this job post");

        // 3. Validate req body
        const validator = validateBody(updateJobPostSchema);
        const { error, value } = await validator(request);
        if(error) return error

        // 4. Update the Job Post
        const updatedJobPost = await prisma.companyMember.update({
            where: {job_post_id},
            data: {...value}
        });

        // 5. NOTIFICATION: Notify all other company members
        // Get other HR members to notify
        const otherMembers = await prisma.companyMember.findMany({
            where: { 
                company_id: parseInt(company_id), 
                user_id: { not: user_id }, // Don't notify the person who edited it
                removed: false 
            },
            select: { user_id: true }
        });

        // Get all applicants for this specific job post
        const applicants = await prisma.jobApplicant.findMany({
            where: { job_post_id: job_post_id },
            select: { user_id: true }
        });

        // Combine into one notification array
        const notificationsToCreate = [
            // Notifications for Team Members (Colleagues)
            ...otherMembers.map(member => ({
                user_id: member.user_id,
                sender_id: user_id, 
                company_id: parseInt(company_id),
                job_post_id: job_post_id,
                type: "JOB_POST_UPDATED",
                message: `${session.user.name} updated the job post: ${job.title}.`
            })),
            
            // Notifications for Applicants
            ...applicants.map(app => ({
                user_id: app.user_id,
                sender_id: null, // System-style notification
                company_id: parseInt(company_id),
                job_post_id: job_post_id,
                type: "JOB_POST_UPDATED",
                message: `The job post "${job.title}" at ${job.company.name} has been updated. Please check for the changes.`
            }))
        ];

        // Only trigger bulk creation if there are recipients to notify.
        // This prevents Prisma errors from attempting to insert an empty array.
        if (notificationsToCreate.length > 0) {
            await prisma.notification.createMany({ data: notificationsToCreate });
        }
        
        return NextResponse.json({message: `Job Post id ${job_post_id} updated!`, data: updatedJobPost},{ status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
}