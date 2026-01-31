import { prisma } from '@/lib/prisma'; // Import the client we just created
import { NextResponse } from 'next/server';
import { ForbiddenError, NotFoundError, UnauthenticatedError, BadRequestError} from '@/errors/errors';
import { handleApiError } from '@/lib/api-error-handler';
import { validateBody } from '@/lib/middlewares/validate';
import { updateJobApplicantSchema } from "@/lib/validators/validators_config"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// edit job applicantion data
export async function PUT(request, { params }) {
    try {
        // applicant_id type validation was done in /proxy.js
        let { applicant_id } = await params;
        applicant_id = parseInt(applicant_id)

        const session = await getServerSession(authOptions);
        if (!session) throw new UnauthenticatedError("Login required");

        // Fetch the application + JobPost + Company in one query
        const application = await prisma.jobApplicant.findUnique({
            where: { applicant_id },
            include: {
                user: { select: { name: true } }, 
                job_post: { 
                    select: { 
                        title: true, 
                        company_id: true,
                        contact_email: true,
                        company: {
                            select: { name: true } 
                        }
                    } 
                }
            }
        });

        if (!application) throw new NotFoundError("Application not found");

        // only company member can update the application
        const isMember = await prisma.companyMember.findFirst({
            where: {
                company_id: application.job_post.company_id,
                user_id: session.user.id,
                removed: false // Must be an active member 
            }
        });

        if (!isMember) {
            // If the person trying to edit is the original applicant
            if (application.user_id === session.user.id) {
                throw new ForbiddenError(
                    `Applicants cannot edit data directly. Please email ${application.job_post.contact_email} to request changes or withdraw.`
                );
            }
            // If it's just a random person
            throw new ForbiddenError("You don't have permission to update this application");
        }

        // Validate the update data (status, interview_date, etc.)
        const validator = validateBody(updateJobApplicantSchema);
        const { error, value } = await validator(request);
        if(error) return error
        
        // Perform the update
        const updatedApplication = await prisma.jobApplicant.update({
            where: { applicant_id },
            data: value
        });

        // notification
        // 1. Fetch Company Members to notify the team (excluding the person who made the change)
        const otherMembers = await prisma.companyMember.findMany({
            where: {
                company_id: application.job_post.company_id,
                user_id: { not: session.user.id }, // Don't notify the person who make the editing
                removed: false
            },
            select: { user_id: true }
        });

        // 2. Prepare Notification Data
        const notificationsToCreate = [
            // Notification for the APPLICANT (user)
            // Display Logic: Shows Company Logo because company_id is present
            {
                user_id: application.user_id, // The recipient (user)
                sender_id: session.user.id,   // The HR person who triggered it
                company_id: application.job_post.company_id, 
                job_post_id: application.job_post_id,
                type: "APPLICANT_STATUS_CHANGE",
                message: `Your application for ${application.job_post.title} @ ${application.job_post.company.name} was updated to ${updatedApplication.status}.`
            },
            // Notifications for OTHER HR MEMBERS
            // Display Logic: Shows the HR Person's Face (sender_id) so colleagues see who did it
            ...otherMembers.map(member => ({
                user_id: member.user_id,
                sender_id: session.user.id,
                company_id: application.job_post.company_id,
                job_post_id: application.job_post_id,
                type: "TEAM_UPDATE",
                message: `Status for application #${application.user.name} was changed by ${session.user.name}.`
            }))
        ];

        // 3. Batch Create
        await prisma.notification.createMany({
            data: notificationsToCreate
        });
        
        return NextResponse.json({ message: "Job Application updated", data: updatedApplication },{ status: 200 });

    } catch (error) {
        return handleApiError(error);
    }
}

/*
{
    user_id: 502,                // Recipient: John (The Applicant)
    sender_id: 10,               // Sender: Sarah (The HR Person)
    company_id: 55,              // Context: TechCorp
    job_post_id: 101,            // Context: Frontend Developer Job
    type: "APP_STATUS_CHANGE",
    message: "Your application status was updated to INTERVIEW.",
    is_read: false,              // Default value from your schema
    created_at: "2023-10-27T10:00:00Z" 
  },
*/