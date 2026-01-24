import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UnauthenticatedError } from '@/errors/errors';
import { handleApiError } from '@/lib/api-error-handler';

export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) throw new UnauthenticatedError("Login required");

        const user_id = parseInt(session.user_id);

        // Update all notifications where user_id matches and is_read is false
        const result = await prisma.notification.updateMany({
            where: { 
                user_id: user_id,
                is_read: false 
            },
            data: { is_read: true }
        });

        return NextResponse.json({ 
            message: `Successfully marked ${result.count} notifications as read.` 
        }, { status: 200 });

    } catch (error) {
        return handleApiError(error);
    }
}