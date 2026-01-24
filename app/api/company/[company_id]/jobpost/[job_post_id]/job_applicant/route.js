import { prisma } from '@/lib/prisma'; // Import the client we just created
import { NextResponse } from 'next/server';
import { ForbiddenError, NotFoundError, UnauthenticatedError, BadRequestError} from '@/errors/errors';
import { handleApiError } from '@/lib/api-error-handler';
import { validateBody } from '@/lib/middlewares/validate';
import { createJobApplicantsSchema } from "@/lib/validators/validators_config"
import { getServerSession } from "next-auth";

// company member to view job applicant
export async function GET(request, {params}) {
    try {
        // 1. Concurrent Parsing & Session Check
        const [param_id, session] = await Promise.all([params, getServerSession()]);
        if (!session) throw new UnauthenticatedError("Unauthorized! Please login!"); 
        
        // company_id type validated in /proxy.js
        const company_id = parseInt(param_id.company_id)
        const job_post_id = parseInt(param_id.job_post_id)

        if(!job_post_id) throw new BadRequestError(`Invalid ID: ${job_post_id} must be numeric`)
      
        // Verify if the job_post_id exist 
        const job = await prisma.JobPost.findUnique({
            where: { job_post_id},
            select: { company_id: true }
        });

        if (!job) {
            throw new NotFoundError(`Job post id ${job_post_id} not found in the company`)
        } 

        // verify if the company owns the job post
        if(job.company_id != company_id) {throw new NotFoundError(`This company does not have this job post!`)}

        // verify this user belongs to the company 
        const isMember = await prisma.companyMember.findFirst({
            where: { 
                company_id, 
                user_id: session.user.id,
                removed: false 
            }
        });

        if(!isMember) throw new ForbiddenError("You are unauthorized to view data")

        // fetch all the applicants data
        const applicants = await prisma.jobApplicant.findMany({
            where: {job_post_id}
        })

        return NextResponse.json({total: applicants.length, data: applicants})

    } catch (error) { 
        return handleApiError(error);
    }
}



// apply job
export async function POST(request, {params}) {
    try {
        const [param_id, session] = await Promise.all([params, getServerSession()]);
        if (!session) throw new UnauthenticatedError("Unauthorized! Please login!"); 
        
        const company_id = parseInt(param_id.company_id);
        const job_post_id = parseInt(param_id.job_post_id);
        const applicant_user_id = parseInt(session.user.id); // From session

        if(!job_post_id) throw new BadRequestError(`Invalid ID: ${job_post_id} must be numeric`)

        // 1. Verify Job exists AND get Title/Company Name for the notification
        const job = await prisma.jobPost.findUnique({
            where: { job_post_id },
            select: { 
                company_id: true,
                title: true,
                company: { select: { name: true } }
            }
        });

        if (!job || job.company_id !== company_id) {
            throw new NotFoundError("Job post not found in this company");
        }

        // 2. Validate req body
        const validator = validateBody(createJobApplicantsSchema);
        const { error, value } = await validator(request);
        if(error) return error;

        // 3. Create the application
        const applyJob = await prisma.jobApplicant.create({
            data: { 
                ...value, 
                user_id: applicant_user_id, 
                job_post_id 
            }
        });

        // 4. NOTIFICATION LOGIC
        // A. Get all active company members to notify HR
        const members = await prisma.companyMember.findMany({
            where: { company_id, removed: false },
            select: { user_id: true }
        });

        const notifications = [
            // Internal Notification for HR Members
            // Display: Applicant's face (sender_id)
            ...members.map(m => ({
                user_id: m.user_id,
                sender_id: applicant_user_id,
                company_id: company_id,
                job_post_id: job_post_id,
                type: "APPLICANT_NEW",
                message: `${session.user.name} applied for ${job.title}.`
            })),
            // Confirmation Notification for the Applicant
            // Display: Company Logo (company_id)
            {
                user_id: applicant_user_id,
                sender_id: null, // System generated
                company_id: company_id,
                job_post_id: job_post_id,
                type: "APPLICANT_STATUS_CHANGE", // Or a specific "APP_SUBMITTED" type
                message: `You successfully applied for ${job.title} @ ${job.company.name}.`
            }
        ];

        await prisma.notification.createMany({ data: notifications });

        return NextResponse.json({ message: "Apply Job successfully", data: applyJob });

    } catch (error) {
        return handleApiError(error);
    }
}

