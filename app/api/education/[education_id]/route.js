import { prisma } from '@/lib/prisma'; 
import { NextResponse } from 'next/server';
import { BadRequestError, NotFoundError , ForbiddenError} from '@/errors/errors';
import { handleApiError } from '@/lib/api-error-handler';
import { validateBody } from '@/lib/middlewares/validate';
import { updateEducationSchema } from "@/lib/validators/validators_config"
//import { getServerSession } from "next-auth";


export async function PUT(request, { params }) {
    try {
        let { education_id } = await params;
        education_id = parseInt(education_id)

        const validator = validateBody(updateEducationSchema);
        const { error, value } = await validator(request);

        if(error) return error

        const record = await prisma.education.findUnique({
            where: { education_id }
        });

        if (!record) {
            throw new NotFoundError(`Education record not found!`)
        }
        
        //const session = await getServerSession()
        if(record.user_id /*== session.user_id*/) {
            const data = await prisma.education.update({
                where: { education_id },
                data: value
            });
            return NextResponse.json({ message: "Education record updated successfully", data});
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

        const record = await prisma.education.findUnique({
            where: { education_id }
        });

        if (!record) {
            throw new NotFoundError(`Education record not found!`)
        }
        
        //const session = await getServerSession()
        if(record.user_id /*== session.user_id*/) {
            await prisma.education.delete({
                where: { education_id }
            });

            return NextResponse.json({ message: "Education record deleted successfully" }, {status: 200});
        } else {
            throw new ForbiddenError("This action is Forbidden")
        }
    } catch (error) {
        
        return handleApiError(error);
    }
}