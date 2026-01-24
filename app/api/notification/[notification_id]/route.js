import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { UnauthenticatedError, NotFoundError , ForbiddenError, BadRequestError} from '@/errors/errors';
import { handleApiError } from '@/lib/api-error-handler';
import { getServerSession } from "next-auth";
import { validateBody } from '@/lib/middlewares/validate';
import { updateNotificationSchema } from "@/lib/validators/validators_config"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"


// for user to mark their own notification as read
export async function PUT(request, {params}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) throw new UnauthenticatedError("Login required");

        const params_id = await params
        const notification_id = parseInt(params_id.notification_id)
        const user_id = parseInt(session.user_id)
       
        if (!notification_id) throw new BadRequestError(`Notification ID must be a number ${params_id.notification_id}`);

        // 1. Check if the notification exists and belongs to the current user
        const notification = await prisma.notification.findUnique({
            where: { notification_id }
        });

        // 2. Existence Check
        if (!notification) {
            throw new NotFoundError(`Notification with ID ${notification_id} not found`);
        }

        // 3. Ownership Check (Security)
        if (notification.user_id !== user_id) {
            throw new ForbiddenError("You do not have permission to modify this notification");
        }

        // 4. validate req body
        const validator = validateBody(updateNotificationSchema);
        const { error, value } = await validator(request);
        if(error) return error

        // 5. Proceed with the update
        const updatedNotification = await prisma.notification.update({
            where: { notification_id } ,
            data: value
        });

        return NextResponse.json({ 
            message: "Notification marked as read", 
            data: updatedNotification 
        }, { status: 200 });

    } catch (error) {
        return handleApiError(error);
    }
}
