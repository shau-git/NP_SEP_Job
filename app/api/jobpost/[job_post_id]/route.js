import { prisma } from '@/lib/prisma'; // Import the client we just created
import { NextResponse } from 'next/server';
import { handleApiError } from '@/lib/api-error-handler';
import { NotFoundError, BadRequestError} from '@/errors/errors';

export async function GET(request, {params}) {
    try {
        // applicant_id type validation was done in /proxy.js
        const param_id = await params;
        const job_post_id = parseInt(param_id.job_post_id)

        if (!job_post_id) throw new BadRequestError(`Invalid ID: ${param_id.job_post_id} must be numeric`)

        const jobPost = await prisma.jobPost.findFirst({
            where: {job_post_id},
            select: {
                job_post_id: true,
                company_id: true,
                title: true,
                industry: true,
                requirements: true,
                responsibilities: true,
                employment_type: true,
                experience: true,
                created_at: true,
                removed: true,
                salary_start: true,
                salary_end: true,
                location: true,
                benefit: true,
                summary: true,
                description: true,
                company: true
            }
        });

        if(!jobPost) throw new NotFoundError("Job Post Not Found")

        return NextResponse.json({total: 1 , data: jobPost},{ status: 200 });

    } catch (error) {
        return handleApiError(error);
    }
}