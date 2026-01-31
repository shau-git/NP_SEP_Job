import {v2 as cloudinary} from 'cloudinary'
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from '@/lib/prisma'; 


export async function POST(request) {
    try {

        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized! Please login!' },{ status: 401 });
        }

        const body = await request.json();
        const { newImageUrl, newPublicId } = body
        
        // 1. Find the user's CURRENT image ID before we update it
        const user = await prisma.user.findUnique({
            where: { user_id: session.user_id },
            select: { image_public_id: true }
        });
        
        // 2. If an old image exists, delete it from Cloudinary
        if (user?.image_public_id) {
            // We don't await this if we want it to be faster, 
            // but awaiting ensures it's gone before we finish.
            await cloudinary.uploader.destroy(user?.image_public_id);
        }
        
        // 3. Update the database with the NEW image details
        const updatedUser = await prisma.user.update({
            where: { user_id: session.user_id },
            data: {
                image: newImageUrl,
                image_public_id: newPublicId
            }
        });

        return NextResponse.json({message: "Image Upload successfully!", data: updatedUser.image }, {status: 200});
    } catch (error) {
        return NextResponse.json({ message: "Image upload failed!" }, { status: 500 });
    }
}