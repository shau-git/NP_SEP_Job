import { prisma } from '@/lib/prisma'; 
import { NextResponse } from 'next/server';
import { UnauthenticatedError, NotFoundError , ForbiddenError} from '@/errors/errors';
import { handleApiError } from '@/lib/api-error-handler';
import { validateBody } from '@/lib/middlewares/validate';
import { updateLanguageSchema} from "@/lib/validators/validators_config"
import { getServerSession } from "next-auth";


export async function PUT(request, { params }) {
    try {
        let { language_id } = await params;
        language_id = parseInt(language_id)

        const session = await getServerSession()
        if (!session) {
            throw new UnauthenticatedError("Unauthorized! Please login!")
        }

        // validate request body
        const validator = validateBody(updateLanguageSchema);
        const { error, value } = await validator(request);
        if(error) return error

        const record = await prisma.language.findUnique({
            where: { language_id }
        });

        if (!record) {
            throw new NotFoundError(`Language id ${language_id} record not found!`)
        }

        // only user themselve can modify their own record
        if(record.user_id == session.user_id) {
            const data = await prisma.language.update({
                where: { language_id },
                data: value
            });
            return NextResponse.json({ message: `Language id ${language_id} record updated successfully`, data},{ status: 200 });
        } else {
            throw new ForbiddenError("This action is Forbidden")
        }

    } catch (error) {
        
        return handleApiError(error);
    }
}


export async function DELETE(request, { params }) {
    try {
        let { language_id } = await params;
        language_id = parseInt(language_id)

        const session = await getServerSession()
        if (!session) {
            throw new UnauthenticatedError("Unauthorized! Please login!")
        }

        const record = await prisma.language.findUnique({
            where: { language_id }
        });

        if (!record) {
            throw new NotFoundError(`Language id ${language_id} record not found!`)
        }
        
        // only user themselve can delete their own record
        if(record.user_id == session.user_id) {
            const deleteRecord = await prisma.language.delete({
                where: { language_id }
            });
            
            console.log('deleting',deleteRecord) // will log out all the data to be deleted

            return NextResponse.json({ message: `Language ${language_id} record deleted successfully` }, {status: 200});
        } else {
            throw new ForbiddenError("This action is Forbidden")
        }
    } catch (error) {
        
        return handleApiError(error);
    }
}
