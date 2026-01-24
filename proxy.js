import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 
import { handleApiError } from '@/lib/api-error-handler';
import { NotFoundError } from '@/errors/errors';

export async function proxy(request) {
    const { pathname } = request.nextUrl;

    // 1. Define base paths to monitor
    const protectedRoutes = [
        '/api/user', 
        '/api/skills', 
        '/api/experience',
        '/api/education',
        '/api/company',
        '/api/jobapplicant',
        '/api/language',
        '/api/link'
    ];

    const base = protectedRoutes.find(b => pathname.startsWith(b));

    try {
        if (base) {
            const segments = pathname.split('/'); 
            // segments[0] = "", [1] = "api", [2] = "route_name", [3] = "id"
            const route = segments[2];
            const id_check = segments[3]; 
            
            // 2. ID Validation (Fast integer check)
            if (id_check) {
                if (!/^\d+$/.test(id_check)) {
                    return NextResponse.json(
                        { error: `Invalid ID: ${id_check} must be numeric` }, 
                        { status: 400 }
                    );
                } 

                const id = parseInt(id_check)

                // 3. Database Existence Check using a Mapping Object
                // This replaces the long if/else chain for better performance
                const modelMapping = {
                    user: { model: prisma.user, field: 'user_id' },
                    // education: { model: prisma.education, field: 'education_id' },
                    // experience: { model: prisma.experience, field: 'experience_id' },
                    // skills: { model: prisma.skill, field: 'skill_id' },
                    company: { model: prisma.company, field: 'company_id' }
                };

                const target = modelMapping[route];

                // check if the id exist
                if (target) {
                    const record = await target.model.findUnique({
                        where: { [target.field]: id }
                    });

                    if (!record) {
                        throw new NotFoundError(`${route} id ${id} record not found!`);
                    }
                }
            }
        }

        return NextResponse.next();
    } catch (error) {
        // This sends the error to your custom handler in api-error-handler.js
        return handleApiError(error);
    }
}

// 4. Matcher to ensure this only runs on your API routes
export const config = {
  matcher: [
    '/api/user/:path*',
    '/api/company/:path*',
    '/api/education/:path*',
    '/api/experience/:path*',
    '/api/skills/:path*',
    '/api/jobapplicant/:path*',
    '/api/language/:path*',
    '/api/link/:path*'
  ],
};