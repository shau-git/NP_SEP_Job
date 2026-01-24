import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { UnauthenticatedError } from '@/errors/errors';
import { handleApiError } from '@/lib/api-error-handler';
import { getServerSession } from "next-auth";

export async function GET(request) {
    try {
        const session = await getServerSession();
        if (!session) throw new UnauthenticatedError("Please login to view notifications");

        const user_id = parseInt(session.user_id);

        // Fetch notifications for the logged-in user
        const notifications = await prisma.notification.findMany({
            where: { user_id: user_id },
            orderBy: { created_at: 'desc', notification_id: 'desc' }, // Newest first
            include: {
                // Include sender info to show who sent it (User profile pic)
                sender: {
                    select: { name: true, image: true }
                },
                // Include company info to show Company Logo if sender_id is null
                company: {
                    select: { name: true, image: true }
                }
            }
        });

        return NextResponse.json({total: notifications.length , data: notifications });
    } catch (error) {
        return handleApiError(error);
    }
}