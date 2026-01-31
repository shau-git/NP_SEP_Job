import {v2 as cloudinary} from 'cloudinary'
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // The secret stays safe on the server
});


export async function POST(request) {
    try {

        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized! Please login!' },{ status: 401 });
        }

        const body = await request.json();
        const { paramsToSign } = body;
        
        console.log('Params to sign:', paramsToSign); // Debug log
        
        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            process.env.CLOUDINARY_API_SECRET
        );
        
        console.log('Generated signature:', signature); // Debug log
        
        return NextResponse.json({ signature });
    } catch (error) {
        console.error('Signature generation error:', error);
        return NextResponse.json({ error: 'Failed to generate signature' }, { status: 500 });
    }
}

