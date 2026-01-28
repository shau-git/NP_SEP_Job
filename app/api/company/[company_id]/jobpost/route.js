import { prisma } from '@/lib/prisma'; // Import the client we just created
import { NextResponse } from 'next/server';
import { ForbiddenError, NotFoundError, UnauthenticatedError} from '@/errors/errors';
import { handleApiError } from '@/lib/api-error-handler';
import { validateBody } from '@/lib/middlewares/validate';
import { createJobPostSchema } from "@/lib/validators/validators_config"
import { getServerSession } from "next-auth";

// post new job post
export async function POST(request, {params}) {
    try {
        let { company_id } = await params;
        company_id = parseInt(company_id)

        const session = await getServerSession()

        if (!session) {
            throw new UnauthenticatedError("Unauthorized! Please login!")
        }

        const user_id = parseInt(session.user_id)

        // 1. Verify membership and get company name for the notification
        const company = await prisma.company.findUnique({
            where: { company_id },
            select: { name: true }
        });

        const isMember = await prisma.companyMember.findFirst({ 
            where: { company_id, user_id, removed: false }
        }); 

        if(!isMember || !company) {
            throw new ForbiddenError(`You cannot add job post for company id ${company_id}`)
        } 

        // 2. Validate request body
        const validator = validateBody(createJobPostSchema);
        const { error, value } = await validator(request);
        if(error) return error

        // 3. Set defaults
        if (!value.contact_email) { value.contact_email = session.user.email; }
        const created_at = new Date().toLocaleDateString('en-CA');

        // 4. Create the Job Post
        const newJobPost = await prisma.jobPost.create({
            data: {...value, company_id, created_at}
        });


        // 5. NOTIFICATION: Notify all other company members
        const otherMembers = await prisma.companyMember.findMany({
            where: { 
                company_id, 
                user_id: { not: user_id }, 
                removed: false 
            },
            select: { user_id: true }
        });

        // Prepare notifications
        const notifications = otherMembers.map(member => ({
            user_id: member.user_id,     // Recipient
            sender_id: user_id,          // The "human" who created it
            company_id: company_id,      // Triggers Company Logo on Frontend
            job_post_id: newJobPost.job_post_id,
            type: "JOB_POST_CREATED",
            message: `${session.user.name} published a new job: ${newJobPost.title} @ ${company.name}.`
        }));

        // Batch create if there are other members
        if (notifications.length > 0) {
            await prisma.notification.createMany({ data: notifications });
        }
        
        return NextResponse.json({message: "New Job Post added!", data: newJobPost}, {status: 201});
    } catch (error) {
        return handleApiError(error);
    }
}
