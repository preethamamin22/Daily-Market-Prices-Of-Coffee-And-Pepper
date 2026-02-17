export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
    try {
        const count = await prisma.dailyPrice.count();
        const latest = await prisma.dailyPrice.findFirst({
            orderBy: { date: 'desc' }
        });

        return NextResponse.json({
            status: "connected",
            database: "PostgreSQL (Neon)",
            totalRecords: count,
            latestRecord: latest ? {
                date: latest.date.toISOString(),
                commodity: latest.commodity,
                district: latest.district,
                price: latest.price
            } : null,
            serverTime: new Date().toISOString(),
            env: {
                DATABASE_URL_SET: !!process.env.DATABASE_URL,
                NEXTAUTH_SECRET_SET: !!process.env.NEXTAUTH_SECRET
            }
        });
    } catch (error: any) {
        return NextResponse.json({
            status: "error",
            message: error.message,
            stack: error.stack,
            env: {
                DATABASE_URL_SET: !!process.env.DATABASE_URL
            }
        }, { status: 500 });
    }
}
