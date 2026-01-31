// import { PrismaClient } from '@prisma/client';
import { PrismaClient } from '@/lib/generated/prisma/client';

// const globalForPrisma = global;

// // This ensures we only have one connection in development
// export const prisma = globalForPrisma.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const globalForPrisma = global 

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL //+ "?pgbouncer=true",
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}