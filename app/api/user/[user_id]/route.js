import { prisma } from '@/lib/prisma'; // Import the client we just created
import { NextResponse } from 'next/server';
import { BadRequestError, NotFoundError} from '@/errors/errors';
import { handleApiError } from '@/lib/api-error-handler';
import { validateBody } from '@/lib/middlewares/validate';

export async function GET(request, { params }) {
    try {
        const { user_id } = await params;

        const userWithData = await prisma.user.findUnique({
            where: { user_id: parseInt(user_id) },
            select: {
                user_id: true,
                name: true,
                image: true,
                email: true,
                summary: true,
                // We simply DON'T include user_id here
                skills: {
                    select: {
                        skill: true,
                        level: true,
                        
                    }
                },
                experiences: {
                    select: {
                        company: true,
                        role: true,
                        years: true,
                        start_date : true,
                        end_date: true,
                        description: true,
                    }
                },
                educations: {
                    select: {
                        institution: true,
                        fieldOfStudy: true,
                        qualification: true,
                        start_date: true,
                        end_date: true,
                        study_type: true,
                        description: true,
                    }
                }
            }
        });

        if (!userWithData) {
            throw new NotFoundError("User not found")
        }
        
        return NextResponse.json(userWithData);
    } catch (error) {
        return handleApiError(error);
    }
}


