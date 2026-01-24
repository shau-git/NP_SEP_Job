import { prisma } from '@/lib/prisma'; 
import { NextResponse } from 'next/server';
import { UnauthenticatedError, ForbiddenError} from '@/errors/errors';
import { handleApiError } from '@/lib/api-error-handler';
import {createEducationSchema} from "@/lib/validators/validators_config"
import { validateBody } from '@/lib/middlewares/validate';
import { getServerSession } from "next-auth";


export async function POST(request, {params}) {
    try {

        let { user_id } = await params;
        user_id = parseInt(user_id)

        const session = await getServerSession()
        if (!session) {
            throw new UnauthenticatedError("Unauthorized! Please login!")
        }

        if (session.user_id != user_id) {
            throw new ForbiddenError("This action is forbidden") 
        }

        // validate req body
        const validator = validateBody(createEducationSchema);
        const { error, value } = await validator(request);

        if(error) return error

        if (value.end_date instanceof Date) {
            // This turns the Object back into "2020-12-31" so the DB accepts it
            value.end_date = value.end_date.toISOString().split('T')[0];
        }

        const data = await prisma.education.create({ data : {...value, user_id}}); 
        return NextResponse.json({message: "Education record added successfully", data}, { status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}





