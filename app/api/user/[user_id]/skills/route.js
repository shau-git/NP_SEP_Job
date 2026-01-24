import { prisma } from '@/lib/prisma'; 
import { NextResponse } from 'next/server';
import { UnauthenticatedError , ForbiddenError} from '@/errors/errors';
import { handleApiError } from '@/lib/api-error-handler';
import { createSkillSchema } from '@/lib/validators/validators_config';
import { validateBody } from '@/lib/middlewares/validate';
import { getServerSession } from "next-auth";

export async function POST(request, {params}) {
    try {
        let {user_id} = await params
        user_id = parseInt(user_id)

        const session = await getServerSession()
        if (!session) {
            throw new UnauthenticatedError("Unauthorized! Please login!")
        }

        // validate req body
        const validator = validateBody(createSkillSchema);
        const { error, value } = await validator(request);
        if(error) return error

        // only user themselve can modify their own record
        if(user_id == session.user_id) {
            const data = await prisma.skill.create({ data : {...value, user_id}}); 
            return NextResponse.json({message: "Skill record added successfully", data }, { status: 201 });
        } else {
            throw new ForbiddenError("This action is Forbidden")
        }
        
    } catch (error) {
        return handleApiError(error);
    }
}

