import { prisma } from '@/lib/prisma'; 
import { NextResponse } from 'next/server';
import { UnauthenticatedError, NotFoundError , ForbiddenError} from '@/errors/errors';
import { handleApiError } from '@/lib/api-error-handler';
import {createCompanyMemberSchema} from "@/lib/validators/validators_config"
import { validateBody } from '@/lib/middlewares/validate';
import { getServerSession } from "next-auth";


export async function GET() {
    try {
        const { company_id } = await params;
        company_id = parseInt(company_id)

        // const company = await prisma.company.findFirst({
        //     where: { company_id}
        // }) 

        // if (!company) {
        //     throw new NotFoundError(`Company id ${company_id} not found`)
        // }
        
        const session = getServerSession()

        if (!session) {
            throw new UnauthenticatedError("Unauthorized! Please login!")
        }

        // only company member can see the company member list
        const isMember = await prisma.companyMember.findUnique({
            where: {
                user_id: parseInt(session.user_id), 
                company_id,
                removed: false
            },
        });

        if(!isMember) {
            throw new ForbiddenError('Unauthorized to view company member list')
        }


        // to filter if user want to find the removed status
        const { searchParams } = new URL(request.url);
        // Example URL: /api/company/1/companymember?removed=true
        const removed = searchParams.get('removed'); // "true"

        // default is filter by company_id only
        const filter = {company_id}
        if(removed) { removed.toLowerCase() === "true"? filter["removed"] = true : filter["removed"] = false}

        const data = await prisma.companyMember.findUnique({
            where: filter,
            select: {
                company_member_id: true,
                company_id: true,
                user_id: true,
                role: true,
                removed: true,
            }
        });

        if(data) {
            return NextResponse({total:1, data},{ status: 200 })
        } else {
            throw new NotFoundError(`Company id ${company_id} has no member`)
        }

    } catch (error) {
        return handleApiError(error);
    }
}



export async function POST(request, { params }) {
    try {
        let { company_id } = await params;
        company_id = parseInt(company_id);

        const session = await getServerSession();
        if (!session) throw new UnauthenticatedError("Unauthorized! Please login!");

        const admin_id = parseInt(session.user_id);

        // 1. Authorization: Only admin/owner can add members
        const admin = await prisma.companyMember.findFirst({
            where: {
                company_id, 
                user_id: admin_id,
                role: { in: ['admin', 'owner'] },
                removed: false
            }
        }); 

        if (!admin) throw new ForbiddenError('Unauthorized to add member in');

        // 2. Validate request body
        const validator = validateBody(createCompanyMemberSchema);
        const { error, value } = await validator(request);
        if (error) return error;

        // not allowed to add new member as the owner
        if(value.role === "owner") {
            throw new ForbiddenError("Cannot add new member as the company owner!")
        }


        // 3. Check if user exists and fetch Company Name
        const [userExist, company] = await Promise.all([
            prisma.user.findUnique({ where: { user_id: value.user_id }, select: { name: true } }),
            prisma.company.findUnique({ where: { company_id }, select: { name: true } })
        ]);

        if (!userExist) throw new NotFoundError(`User id ${value.user_id} does not exist.`);

        // 4. Create the new member record
        const newMember = await prisma.companyMember.create({
            data: { ...value, company_id }
        });

        // 5. NOTIFICATION LOGIC
        // Get all active members EXCEPT the admin and the new person
        const teamToNotify = await prisma.companyMember.findMany({
            where: {
                company_id,
                removed: false,
                user_id: { notIn: [admin_id, value.user_id] }
            },
            select: { user_id: true }
        });

        const notifications = [
            // A. Notify the New Member (shows Admin's face as sender)
            {
                user_id: value.user_id,
                sender_id: admin_id,
                company_id: company_id,
                type: "COMPANY_MEMBER_ADD",
                message: `Welcome! You've been added to ${company.name} as a ${value.role}.`
            },
            // B. Notify the Rest of the Team (shows New Member's face as sender)
            ...teamToNotify.map(m => ({
                user_id: m.user_id,
                sender_id: value.user_id, // Shows the new person's face to colleagues
                company_id: company_id,
                type: "TEAM_UPDATE",
                message: `${userExist.name} has joined the ${company.name} team as a ${value.role}.`
            }))
        ];

        // 6. Batch Create
        if (notifications.length > 0) {
            await prisma.notification.createMany({ data: notifications });
        }
        
        return NextResponse.json({ message: "New Member Added!", data: newMember },{ status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}
