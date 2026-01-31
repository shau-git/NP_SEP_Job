import { prisma } from '@/lib/prisma'; // Import the client we just created
import { NextResponse } from 'next/server';
import { ForbiddenError, NotFoundError, BadRequestError, UnauthenticatedError} from '@/errors/errors';
import { handleApiError } from '@/lib/api-error-handler';
import { validateBody } from '@/lib/middlewares/validate';
import { updateCompanySchema} from "@/lib/validators/validators_config"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request, { params }) {
    try {
        let { company_id } = await params;
        company_id = parseInt(company_id)

        const session  = await getServerSession(authOptions)

        // 1. Check if the person viewing is a member of this company
        const isMember = session ? await prisma.companyMember.findFirst({
            where: { 
                company_id: parseInt(company_id), 
                user_id: parseInt(session.user_id), 
                removed: false 
            }
        }) : null;

        // proceed get the company data
        const companyData = await prisma.company.findUnique({
            where: { company_id: parseInt(company_id) },
            select: {
                company_id: true,
                name: true,
                image: true,
                industry: true,
                location: true,
                description: true,
                job_posts: {
                    // IF Member: see all. IF Public: see only active.
                    where: isMember ? {} : { removed: false },
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
                        contact_email: true,
                    }
                }
            }
        });

        if (!companyData) throw new NotFoundError("Company not found");
        
        return NextResponse.json({total: 1 , data: companyData}, {status: 200});
    } catch (error) {
        return handleApiError(error);
    }
}


export async function PUT(request, {params}) {
    try {
        let { company_id } = await params;
        company_id = parseInt(company_id)

        // const company = await prisma.company.findFirst({
        //     where: { company_id}
        // }) 

        // if (!company) {
        //     throw new NotFoundError(`Company id ${company_id} not found`)
        // }


        const session = await getServerSession(authOptions)
        if (!session) {
            throw new UnauthenticatedError("Unauthorized! Please login!")
        }

        const user_id = parseInt(session.user_id)

        // 1. Authorization: Only admin and owner can modify company data
        const admin = await prisma.companyMember.findFirst({
            where: {
                company_id, 
                user_id, //user_id: session.user_id
                role: { in: ['admin', 'owner'] },
                removed: false
            }
        }) 

        if (!admin) {
            throw new ForbiddenError('Unauthorized access to modify company data')
        }

        // 2. Validate request body data
        const validator = validateBody(updateCompanySchema);
        const { error, value } = await validator(request);
        if(error) return error

        // 3. Check if the company name already exists (if name is being changed)
        if (value.name) {
            const existName = await prisma.company.findFirst({
                where: {
                    name: value.name,
                    NOT: { company_id: company_id } // Ensure it's not the current company
                }
            });

            if (existName) {
                throw new BadRequestError(`${value.name} is already registered, please choose another name.`);
            }
        }

        

        // 4. Update company data
        const newCompanyData = await prisma.company.update({
            where: { company_id },
            data: value
        });
        
        // 5. NOTIFICATION: Notify all other company members about the profile update
        const otherMembers = await prisma.companyMember.findMany({
            where: { 
                company_id, 
                user_id: { not: user_id }, 
                removed: false 
            },
            select: { user_id: true }
        });

        const notifications = otherMembers.map(member => ({
            user_id: member.user_id,
            sender_id: user_id, // The admin who made the change
            company_id: company_id,
            type: "COMPANY_PROFILE_UPDATE",
            message: `${session.user.name} updated the company profile information for ${updatedCompany.name}.`
        }));

        if (notifications.length > 0) {
            await prisma.notification.createMany({ data: notifications });
        }

        return NextResponse.json({message: "Company data updated successfully!", data: newCompanyData}, {status: 200});
    } catch (error) {
        return handleApiError(error);
    }
}