import { prisma } from '@/lib/prisma'; 
import { NextResponse } from 'next/server';
import { BadRequestError, NotFoundError , ForbiddenError} from '@/errors/errors';
import { handleApiError } from '@/lib/api-error-handler';
import {createEducationSchema} from "@/lib/validators/validators_config"
import { validateBody } from '@/lib/middlewares/validate';
//import { getServerSession } from "next-auth";


export async function POST(request, {params}) {
    try {

        let { user_id } = await params;
        user_id = parseInt(user_id)

        //const {user_id: current_user_id} = await getServerSession()
        // if (current_user_id != user_id) {
        // throw new ForbiddenError("This action is forbidden") 
        //}

        const validator = validateBody(createEducationSchema);
        const { error, value } = await validator(request);
        console.log(value)

        if(error) return error

        const data = await prisma.education.create({ data : {...value, user_id}}); 
        return NextResponse.json({message: "Education record added successfully", data}, { status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}





