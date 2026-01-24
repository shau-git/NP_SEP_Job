import { prisma } from '@/lib/prisma'; 
import { NextResponse } from 'next/server';
import { NotFoundError , ForbiddenError, UnauthenticatedError} from '@/errors/errors';
import { handleApiError } from '@/lib/api-error-handler';
import { validateBody } from '@/lib/middlewares/validate';
import { updateSkillSchema} from "@/lib/validators/validators_config"
import { getServerSession } from "next-auth";


export async function PUT(request, { params }) {
    try {
        let { skill_id } = await params;
        skill_id = parseInt(skill_id)

        const session = await getServerSession()
        if (!session) {
            throw new UnauthenticatedError("Unauthorized! Please login!")
        }

        const record = await prisma.skill.findUnique({
            where: { skill_id }
        });

        if (!record) {
            throw new NotFoundError(`Skill id ${skill_id} record not found!`)
        }

        // validate req body
        const validator = validateBody(updateSkillSchema);
        const { error, value } = await validator(request);

        if(error) return error

        // only user themselve can modify their own record
        if(record.user_id == session.user_id) {
            const data = await prisma.skill.update({
                where: { skill_id },
                data: value
            });
            return NextResponse.json({ message: `Skill id ${skill_id} record updated successfully`, data});
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

        const session = await getServerSession()
        if (!session) {
            throw new UnauthenticatedError("Unauthorized! Please login!")
        }

        const record = await prisma.skill.findUnique({
            where: { skill_id }
        });

        if (!record) {
            throw new NotFoundError(`Skill id ${skill_id} record not found!`)
        }

        // only user themselve can delete their own record
        if(record.user_id == session.user_id) {
            await prisma.skill.delete({
                where: { skill_id }
            });

            return NextResponse.json({ message: `Skill id ${skill_id} record deleted successfully` }, {status: 200});
        } else {
            throw new ForbiddenError("This action is Forbidden")
        }

    } catch (error) {
        
        return handleApiError(error);
    }
}
