import { prisma } from '@/lib/prisma'; 
import { NextResponse } from 'next/server';
import { UnauthenticatedError, NotFoundError , ForbiddenError} from '@/errors/errors';
import { handleApiError } from '@/lib/api-error-handler';
import { validateBody } from '@/lib/middlewares/validate';
import { updateExperienceSchema} from "@/lib/validators/validators_config"
import { getServerSession } from "next-auth";


export async function PUT(request, { params }) {
    try {
        let { experience_id } = await params;
        experience_id = parseInt(experience_id)

        const session = await getServerSession()
        if (!session) {
            throw new UnauthenticatedError("Unauthorized! Please login!")
        }

        // validate request body
        const validator = validateBody(updateExperienceSchema);
        const { error, value } = await validator(request);
        if(error) return error

        const record = await prisma.experience.findUnique({
            where: { experience_id }
        });

        if (!record) {
            throw new NotFoundError(`Experience id ${experience_id} record not found!`)
        }

        // only user themselve can modify their own record
        if(record.user_id == session.user_id) {
            const data = await prisma.experience.update({
                where: { experience_id },
                data: value
            });
            return NextResponse.json({ message: `Experience id ${experience_id} record updated successfully`, data},{ status: 200 });
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

        const session = await getServerSession()
        if (!session) {
            throw new UnauthenticatedError("Unauthorized! Please login!")
        }

        const record = await prisma.experience.findUnique({
            where: { experience_id }
        });

        if (!record) {
            throw new NotFoundError(`Experience id ${experience_id} record not found!`)
        }
        
        // only user themselve can delete their own record
        if(record.user_id == session.user_id) {
            const deleteRecord = await prisma.experience.delete({
                where: { experience_id }
            });
            
            console.log('deleting',deleteRecord) // will log out all the data to be deleted

            return NextResponse.json({ message: `Experience ${experience_id} record deleted successfully` }, {status: 200});
        } else {
            throw new ForbiddenError("This action is Forbidden")
        }
    } catch (error) {
        
        return handleApiError(error);
    }
}
