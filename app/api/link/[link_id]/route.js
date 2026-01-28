import { prisma } from '@/lib/prisma'; 
import { NextResponse } from 'next/server';
import { UnauthenticatedError, NotFoundError , ForbiddenError} from '@/errors/errors';
import { handleApiError } from '@/lib/api-error-handler';
import { validateBody } from '@/lib/middlewares/validate';
import { updateLinkSchema} from "@/lib/validators/validators_config"
import { getServerSession } from "next-auth";


export async function PUT(request, { params }) {
    try {
        let { link_id } = await params;
        link_id = parseInt(link_id)

        const session = await getServerSession()
        if (!session) {
            throw new UnauthenticatedError("Unauthorized! Please login!")
        }

        // validate request body
        const validator = validateBody(updateLinkSchema);
        const { error, value } = await validator(request);
        if(error) return error

        const record = await prisma.link.findUnique({
            where: { link_id }
        });

        if (!record) {
            throw new NotFoundError(`Link id ${link_id} record not found!`)
        }

        // only user themselve can modify their own record
        if(record.user_id == session.user_id) {
            const data = await prisma.link.update({
                where: { link_id },
                data: value
            });
            return NextResponse.json({ message: `Link id ${link_id} record updated successfully`, data},{ status: 200 });
        } else {
            throw new ForbiddenError("This action is Forbidden")
        }

    } catch (error) {
        
        return handleApiError(error);
    }
}


export async function DELETE(request, { params }) {
    try {
        let { link_id } = await params;
        link_id = parseInt(link_id)

        const session = await getServerSession()
        if (!session) {
            throw new UnauthenticatedError("Unauthorized! Please login!")
        }

        const record = await prisma.link.findUnique({
            where: { link_id }
        });

        if (!record) {
            throw new NotFoundError(`Link id ${link_id} record not found!`)
        }
        
        // only user themselve can delete their own record
        if(record.user_id == session.user_id) {
            await prisma.link.delete({
                where: { link_id }
            });

            return NextResponse.json({ message: `Link ${link_id} record deleted successfully` }, {status: 200});
        } else {
            throw new ForbiddenError("This action is Forbidden")
        }
    } catch (error) {
        
        return handleApiError(error);
    }
}
