import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const databaseUrl = process.env.DATABASE_URL;

if (process.env.NODE_ENV === "production" && !databaseUrl) {
    console.error("FATAL: DATABASE_URL is missing from environment variables.");
}

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
        datasources: databaseUrl ? {
            db: {
                url: databaseUrl,
            },
        } : undefined,
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
