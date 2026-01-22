import { NextResponse } from 'next/server';
import { CustomAPIError } from '../errors/errors'; // Adjust path

export function handleApiError(error) {
    // 1. Handle Custom Errors (NotFoundError, BadRequestError, etc.)
    if (error instanceof CustomAPIError) {
        return NextResponse.json(
            { error: error.message }, 
            { status: error.statusCode || 400 }
        );
    }

    // 2. Fallback for unknown errors
    console.error("Unhandled Error:", error);
    return NextResponse.json(
        { error: "Internal Server Error" }, 
        { status: 500 }
    );
}