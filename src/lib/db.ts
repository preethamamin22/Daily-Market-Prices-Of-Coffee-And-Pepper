import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
    console.error("CRITICAL ERROR: DATABASE_URL is not set in Vercel environment variables!");
}

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
