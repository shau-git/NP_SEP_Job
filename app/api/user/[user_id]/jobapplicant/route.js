import { prisma } from '@/lib/prisma'; // Import the client we just created
import { NextResponse } from 'next/server';
import { ForbiddenError, NotFoundError, UnauthenticatedError, BadRequestError} from '@/errors/errors';
import { handleApiError } from '@/lib/api-error-handler';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// for user to get their own job applicantion data
export async function GET(request, {params}) {
    try {

        const session = getServerSession(authOptions)
        if (!session) throw new UnauthenticatedError("Unauthorized! Please login!");

        const {user_id} = await params

        // user can only view their own record
        if(session.user_id != user_id) throw new ForbiddenError("Unauthorized to view data!")

        const myApplications = await prisma.jobApplicant.findMany({
            where: { user_id: parseInt(user_id) },
            select: {
                applicant_id: true,
                user_id: true,
                job_post_id: true,
                status: true,
                expected_salary: true,
                applied_date: true,
                interview_date: true,
                interview_time: true,
            }
        });
        
        return NextResponse.json({total: myApplications.length, data: myApplications}, { status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
}