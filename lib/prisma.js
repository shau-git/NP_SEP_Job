// import { PrismaClient } from '@prisma/client';
import { PrismaClient } from '@/lib/generated/prisma/client';

const globalForPrisma = global;

// This ensures we only have one connection in development
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;