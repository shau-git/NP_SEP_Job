import { prisma } from '@/lib/prisma'; // Import the client we just created
import { NextResponse } from 'next/server';
import { NotFoundError, BadRequestError, UnauthenticatedError, ForbiddenError} from '@/errors/errors';
import { handleApiError } from '@/lib/api-error-handler';
import { getServerSession } from "next-auth";
import { updateUserSchema } from '@/lib/validators/validators_config';
import { validateBody } from '@/lib/middlewares/validate';
import bcrypt from 'bcryptjs'
import { getServerSession } from "next-auth";

export async function GET(request, { params }) {
    try {
        const { user_id } = await params;

        const selectFields = {
            user_id: true,
            name: true,
            image: true,
            email: true,
            summary: true,
            languages: {
                select: {
                    language_id: true,
                    language: true,
                    proficiency: true
                }
            },
            links: {
                select: {
                    link_id: true,
                    type: true,
                    url: true
                }
            },
            experiences: {
                select: {
                    experience_id: true,
                    company: true,
                    role: true,
                    years: true,
                    start_date: true,
                    end_date: true,
                    description: true,
                }
            },
            educations: {
                select: {
                    education_id: true,
                    institution: true,
                    field_of_study: true,
                    qualification: true,
                    start_date: true,
                    end_date: true,
                    study_type: true,
                    description: true,
                }
            },
            skills: {
                select: {
                    skill_id: true,
                    skill: true,
                }
            },
        }

        const session = getServerSession()
        if(user_id == session.user_id) {
            selectFields.company_members = {
                select: {
                    // Specify the fields you want to return here
                    id: true,
                    company_id: true,
                    role: true,
                }
            };
            selectFields.job_applicants = {
                select: {
                    id: true,
                    job_id: true,
                    status: true,
                }
            };
        }

        const userWithData = await prisma.user.findMany({
            where: { user_id: parseInt(user_id) },
            select: selectFields
        });

        if (!userWithData) {
            throw new NotFoundError(`User id ${user_id} not found`)
        }
        
        return NextResponse.json({data: userWithData});
    } catch (error) {
        return handleApiError(error);
    }
}




// user change their profile
export async function PUT(request, {params}) {
    try {

        let { user_id } = await params; 
        user_id = parseInt(user_id)

        const session = await getServerSession(authOptions);
        if (!session) throw new UnauthenticatedError("Login required");

        if(session.user_id != user_id) throw new ForbiddenError("You can only modify your own profile!")

        // validate request body
        const validator = validateBody(updateUserSchema);
        const { error, value } = await validator(request);
        if(error) return error


        if(value.password) {
            // encrypt user's password before storing
            const salt = await bcrypt.genSalt(10);
            value.password = await bcrypt.hash(value.password, salt)
        }

        // create new user
        const updatedUser = await prisma.user.update({ 
            where: { user_id },
            data: value,
            select: {
                user_id: true,
                name: true,
                email: true,
                image: true,
                summary: true
            }
        }); 

        return NextResponse.json({message: "User data updated successfully!" , data: updatedUser}, { status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
}
