import { prisma } from '@/lib/prisma'; // Import the client we just created
import { NextResponse } from 'next/server';
import { handleApiError } from '@/lib/api-error-handler';
import { createUserSchema } from '@/lib/validators/validators_config';
import { validateBody } from '@/lib/middlewares/validate';
import { BadRequestError} from '@/errors/errors';
import bcrypt from 'bcryptjs'

export async function POST(request) {
    try {
        // validate request body
        const validator = validateBody(createUserSchema);
        const { error, value } = await validator(request);
        console.log(value)

        if(error) return error

        // ensure the same email is not stored in db
        const emailExist = await prisma.user.findUnique({
            where: { email: value.email }
        });

        if (emailExist) {
            throw new BadRequestError(`Email already exist! Please use another email!`)
        }

        // encrypt user's password before storing
        const salt = await bcrypt.genSalt(10);
        value.password = await bcrypt.hash(value.password, salt)

        // create new user
        const newUser = await prisma.user.create({ data: value }); 
        return NextResponse.json({message: "User register successfully" ,data: newUser}, { status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}