import { prisma } from '@/lib/prisma'; 
import { NextResponse } from 'next/server';
import { UnauthenticatedError, ForbiddenError} from '@/errors/errors';
import { handleApiError } from '@/lib/api-error-handler';
import {createLinkSchema} from "@/lib/validators/validators_config"
import { validateBody } from '@/lib/middlewares/validate';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request, {params}) {
    try {

        let { user_id } = await params;
        user_id = parseInt(user_id)

        const session = await getServerSession(authOptions)
        if (!session) {
            throw new UnauthenticatedError("Unauthorized! Please login!")
        }

        if (user_id != session.user_id) {
            throw new ForbiddenError("This action is forbidden") 
        }

        // validate req body
        const validator = validateBody(createLinkSchema);
        const { error, value } = await validator(request);
        if(error) return error

        const addedLink = await prisma.link.create({ data : {...value, user_id}}); 
        return NextResponse.json({message: "Link added successfully", data: addedLink}, { status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}

