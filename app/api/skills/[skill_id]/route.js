import { prisma } from '@/lib/prisma'; 
import { NextResponse } from 'next/server';
import { BadRequestError, NotFoundError , ForbiddenError} from '@/errors/errors';
import { handleApiError } from '@/lib/api-error-handler';
import { validateBody } from '@/lib/middlewares/validate';
import { updateSkillSchema} from "@/lib/validators/validators_config"
//import { getServerSession } from "next-auth";


export async function PUT(request, { params }) {
    try {
        let { skill_id } = await params;
        skill_id = parseInt(skill_id)

        const validator = validateBody(updateSkillSchema);
        const { error, value } = await validator(request);

        if(error) return error

        const record = await prisma.skill.findUnique({
            where: { skill_id }
        });

        if (!record) {
            throw new NotFoundError(`Skill record not found!`)
        }
        
        //const session = await getServerSession()
        if(record.user_id /*== session.user_id*/) {
            const data = await prisma.skill.update({
            where: { skill_id },
            data: value
        });
            return NextResponse.json({ message: "Skill record updated successfully", data});
        } else {
            throw new ForbiddenError("This action is Forbidden")
        }
    } catch (error) {
        
        return handleApiError(error);
    }
}


export async function DELETE(request, { params }) {
    try {
        const { skill_id } = await params;
        skill_id = parseInt(skill_id)

        const record = await prisma.skill.findUnique({
            where: { skill_id }
        });

        if (!record) {
            throw new NotFoundError(`Skill record not found!`)
        }
        
        //const session = await getServerSession()
        if(record.user_id /*== session.user_id*/) {
            await prisma.skill.delete({
                where: { skill_id }
            });

            return NextResponse.json({ message: "Skill record deleted successfully" }, {status: 200});
        } else {
            throw new ForbiddenError("This action is Forbidden")
        }

    } catch (error) {
        
        return handleApiError(error);
    }
}
