import { prisma } from '@/lib/prisma'; 
import { NextResponse } from 'next/server';
import { BadRequestError, NotFoundError , ForbiddenError} from '@/errors/errors';
import { handleApiError } from '@/lib/api-error-handler';
import {createCompanySchema} from "@/lib/validators/validators_config"
import { validateBody } from '@/lib/middlewares/validate';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function POST(request, {params}) {
    try {

        let { company_id } = await params;
        company_id = parseInt(company_id)

        const session = await getServerSession(authOptions)
        if (!session) {
            throw new UnauthenticatedError("Unauthorized! Please login!")
        }

        const user_id = parseInt(session.user_id)

        // validate req body
        const validator = validateBody(createCompanySchema);
        const { error, value } = await validator(request);
        if(error) return error

        // prevent same company name
        const existName = await prisma.company.findFirst({
            where: {
                name: value.name
            }
        })

        if(existName) {
            throw new BadRequestError(`${value.name} already registred, please change to another name.`)
        }

        // proceed register the company
        const data = await prisma.company.create({ data : {...value, user_id}}); 
        // make the creator as the company owner
        const owner = await prisma.company_member_id.create({
            data: {
                company_id: data.company_id,
                user_id,
                role: "owner",
                removed: false
            }
        })

        return NextResponse.json({message: `Company registered successfull`, data, owner }, { status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}


