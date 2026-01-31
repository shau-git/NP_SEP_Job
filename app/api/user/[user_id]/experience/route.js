import { prisma } from '@/lib/prisma'; 
import { NextResponse } from 'next/server';
import { UnauthenticatedError, ForbiddenError} from '@/errors/errors';
import { handleApiError } from '@/lib/api-error-handler';
import {createExperienceSchema} from "@/lib/validators/validators_config"
import { validateBody } from '@/lib/middlewares/validate';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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

        const session = await getServerSession(authOptions)
        if (!session) {
            throw new UnauthenticatedError("Unauthorized! Please login!")
        }

        if (user_id != session.user_id) {
            throw new ForbiddenError("This action is forbidden") 
        }

        // validate req body
        const validator = validateBody(createExperienceSchema);
        const { error, value } = await validator(request);
        if(error) { console.log(error); return error}

        if (value.end_date instanceof Date) {
            // This turns the Object back into "2020-12-31" so the DB accepts it
            value.end_date = value.end_date.toISOString().split('T')[0];
        }

        const addedExperience = await prisma.experience.create({ data : {...value, user_id}}); 
        return NextResponse.json({message: "Experience record added successfully", data: addedExperience}, { status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}





