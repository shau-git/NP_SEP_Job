import { prisma } from '@/lib/prisma'; // Import the client we just created
import { NextResponse } from 'next/server';
import { handleApiError } from '@/lib/api-error-handler';

export async function GET(request) {
    try {

        // to filter if user want to find the removed status
        const { searchParams } = new URL(request.url);
        // Example URL: /api/company/1/companymember?title=software%20engineer
        const titleQuery = searchParams.get('title'); // "software enginner"

        const filter = { removed: false }

        if(titleQuery) {
            filter.title = {contains: titleQuery, mode: 'insensitive'}
        }

        const allJobPost = await prisma.jobPost.findMany({
            where: filter,
            orderBy: [
                { created_at: 'desc' },
                { job_post_id: 'desc' }
            ],
            select: {
                job_post_id: true,
                company_id: true,
                title: true,
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
                company: true
            }
        });

        return NextResponse.json({total: allJobPost.length , data: allJobPost});

    } catch (error) {
        return handleApiError(error);
    }
}