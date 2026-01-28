import { prisma } from '@/lib/prisma'; 
import { NextResponse } from 'next/server';
import { UnauthenticatedError, NotFoundError , ForbiddenError, BadRequestError} from '@/errors/errors';
import { handleApiError } from '@/lib/api-error-handler';
import { updateCompanyMemberSchema} from "@/lib/validators/validators_config"
import { validateBody } from '@/lib/middlewares/validate';
import { getServerSession } from "next-auth";


export async function PUT(request, {params}) {
    try {
        // Concurrent Parsing & Session Check
        const [param_id, session] = await Promise.all([params, getServerSession(authOptions)]);
        if (!session) throw new UnauthenticatedError("Unauthorized! Please login!");
        
        const user_id = parseInt(session.user_id)
        const company_id = parseInt(param_id.company_id)
        const company_member_id = parseInt(company_member_id)

        if(!company_member_id) throw new BadRequestError(`Company_member_id must be a number : ${param_id.company_member_id}!`)

        // Validate req body
        const validator = validateBody(updateCompanyMemberSchema);
        const { error, value } = await validator(request);
        if(error) return error

        // only company admin and owner can modify member data
        const executorRight = await prisma.companyMember.findFirst({
            where: {
                company_id, 
                user_id,
                role: { in: ['admin', 'owner'] },
                removed: false
            }
        }) 

        if (!executorRight) {
            throw new ForbiddenError('Unauthorized to add member in!')
        }

        
        // check if the member to be modified exist in the company
        const memberToModify = await prisma.companyMember.findFirst({ 
            where: { company_id, company_member_id  },
            include: { company: { select: { name: true } } }
        }); 

        if(!memberToModify) {
            throw new NotFoundError(`Company id ${company_id} has no company member id ${company_member_id}!`)
        } 
        
        // Owners can do anything. Admins have restrictions.
        if(executorRight.role === "admin") {
            // Admin cannot touch an Owner
            if (memberToModify.role === "owner") {
                throw new ForbiddenError("Unauthorized to change owner's data")
            }

            // Admin cannot promote someone to Owner
            if(value.role === "owner") {
                throw new ForbiddenError("Unauthorized to change member to owner")
            }
        }
        
        const newCompanyMemberData = await prisma.companyMember.update({
            where: { company_member_id },
            data: value
        });

        // Notification logic (Notify the user whose role changed)
        await prisma.notification.create({
            data: {
                user_id: memberToModify.user_id,
                sender_id: user_id, // The admin/owner who made the change
                company_id: parseInt(company_id),
                type: value.removed ? "COMPANY_MEMBER_REMOVE" : "COMPANY_MEMBER_UPDATE",
                message: value.removed 
                    ? `Your access to ${memberToModify.company.name} has been revoked.` 
                    : `Your role at ${memberToModify.company.name} was updated to ${value.role}.`
            }
        });
        
        return NextResponse.json({message: "Member's data modified successfully!", data: newCompanyMemberData},{ status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
}


    