import { prisma } from '@/lib/prisma'; 
import { NextResponse } from 'next/server';
import { NotFoundError , ForbiddenError, UnauthenticatedError} from '@/errors/errors';
import { handleApiError } from '@/lib/api-error-handler';
import { validateBody } from '@/lib/middlewares/validate';
import { updateEducationSchema } from "@/lib/validators/validators_config"
import { getServerSession } from "next-auth";


export async function PUT(request, { params }) {
    try {
        let { education_id } = await params;
        education_id = parseInt(education_id)

        const session = await getServerSession()
        if (!session) {
            throw new UnauthenticatedError("Unauthorized! Please login!")
        }

        // validate request body
        const validator = validateBody(updateEducationSchema);
        const { error, value } = await validator(request);
        if(error) return error

        // check if the education_id exist
        const record = await prisma.education.findUnique({
            where: { education_id }
        });

        if (!record) {
            throw new NotFoundError(`Education id ${education_id} record not found!`)
        }

        if (value.end_date instanceof Date) {
            // This turns the Object back into "2020-12-31" so the DB accepts it
            value.end_date = value.end_date.toISOString().split('T')[0];
        }
        
        // only the user themselve can modify their own record
        if(record.user_id == session.user_id) {
            const data = await prisma.education.update({
                where: { education_id },
                data: value
            });
            return NextResponse.json({ message: `Education id ${education_id} record updated successfully`, data},{ status: 200 });
        } else {
            throw new ForbiddenError("This action is Forbidden")
        }

    } catch (error) {
        
        return handleApiError(error);
    }
}



export async function DELETE(request, { params }) {
    try {
        let { education_id } = await params;
        education_id = parseInt(education_id)

        const session = await getServerSession()
        if (!session) {
            throw new UnauthenticatedError("Unauthorized! Please login!")
        }

        const record = await prisma.education.findUnique({
            where: { education_id }
        });

        if (!record) {
            throw new NotFoundError(`Education id ${education_id} record not found!`)
        }
        
        // only the user themselve can delete their own record
        if(record.user_id == session.user_id) {
            await prisma.education.delete({
                where: { education_id }
            });

            return NextResponse.json({ message: `Education id ${education_id} record deleted successfully` }, {status: 200});
        } else {
            throw new ForbiddenError("This action is Forbidden")
        }
    } catch (error) {
        
        return handleApiError(error);
    }
}