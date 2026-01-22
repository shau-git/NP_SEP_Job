import { prisma } from '@/lib/prisma'; 
import { NextResponse } from 'next/server';
import { BadRequestError, NotFoundError , ForbiddenError} from '@/errors/errors';
import { handleApiError } from '@/lib/api-error-handler';
import { validateBody } from '@/lib/middlewares/validate';
import { updateExperienceSchema} from "@/lib/validators/validators_config"
//import { getServerSession } from "next-auth";


export async function PUT(request, { params }) {
    try {
        let { experience_id } = await params;
        experience_id = parseInt(experience_id)

        const validator = validateBody(updateExperienceSchema);
        const { error, value } = await validator(request);

        if(error) return error

        const record = await prisma.experience.findUnique({
            where: { experience_id }
        });

        if (!record) {
            throw new NotFoundError(`Experience record not found!`)
        }
        
        //const session = await getServerSession()
        if(record.user_id /*== session.user_id*/) {
            const data = await prisma.experience.update({
                where: { experience_id },
                data: value
            });
            return NextResponse.json({ message: "Experience record updated successfully", data});
        } else {
            throw new ForbiddenError("This action is Forbidden")
        }

    } catch (error) {
        
        return handleApiError(error);
    }
}


export async function DELETE(request, { params }) {
    try {
        let { experience_id } = await params;
        experience_id = parseInt(experience_id)

        const record = await prisma.experience.findUnique({
            where: { experience_id }
        });

        if (!record) {
            throw new NotFoundError(`Experience record not found!`)
        }
        
        //const session = await getServerSession()
        if(record.user_id /*== session.user_id*/) {
            const deleteRecord = await prisma.experience.delete({
                where: { experience_id }
            });

            console.log('deleting',deleteRecord) // will log out all the data to be deleted

            return NextResponse.json({ message: "Experience record deleted successfully" }, {status: 200});
        } else {
            throw new ForbiddenError("This action is Forbidden")
        }
    } catch (error) {
        
        return handleApiError(error);
    }
}
