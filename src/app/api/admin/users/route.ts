import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const users = await prisma.user.findMany({
            include: {
                sessions: {
                    orderBy: { createdAt: "desc" },
                    take: 1
                }
            },
            orderBy: { createdAt: "desc" }
        });

        const stats = {
            totalUsers: users.length,
            newUsersThisWeek: users.filter((u: any) => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return u.createdAt > weekAgo;
            }).length,
            activeToday: users.filter((u: any) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return u.lastLogin && u.lastLogin > today;
            }).length
        };

        return NextResponse.json({ users, stats });
    } catch (error) {
        console.error("Error fetching admin users:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
