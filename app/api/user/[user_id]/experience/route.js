import { prisma } from '@/lib/prisma'; 
import { NextResponse } from 'next/server';
import { BadRequestError, NotFoundError , ForbiddenError} from '@/errors/errors';
import { handleApiError } from '@/lib/api-error-handler';
import {createExperienceSchema} from "@/lib/validators/validators_config"
import { validateBody } from '@/lib/middlewares/validate';
//import { getServerSession } from "next-auth";

// export async function GET({params}) {
//     try {

//         let { user_id } = await params;
//         user_id = parseInt(user_id)
        
//         const experience = await prisma.experience.findMany({ 
//             where: {
//                 user_id
//             }
//         }); 

//         console.log(experience)

//         if(!experience) {
//             return NextResponse.json({message: "This user has no expereince record"}, { status: 200 })
//         }
//         return NextResponse.json(experience, { status: 200 })
//     } catch (error) {
//         return handleApiError(error);
//     }
// }


export async function POST(request, {params}) {
    try {

        let { user_id } = await params;
        user_id = parseInt(user_id)

        //const session = await getServerSession()
        // if (user_id != session.user_id) {
        // throw new ForbiddenError("This action is forbidden") 
        //}

        const validator = validateBody(createExperienceSchema);
        const { error, value } = await validator(request);
        console.log(value)

        if(error) return error

        const addedExperience = await prisma.experience.create({ data : {...value, user_id}}); 
        return NextResponse.json({message: "Experience record added successfully", data: addedExperience}, { status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}





