import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { subDays, startOfDay } from "date-fns";
import { PriceData, HistoryData } from "@/types/price";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const commodity = searchParams.get("commodity");
    const district = searchParams.get("district");
    const days = parseInt(searchParams.get("days") || "30");

    try {
        const startDate = startOfDay(subDays(new Date(), days));

        const prices = await prisma.dailyPrice.findMany({
            where: {
                ...(commodity && { commodity }),
                ...(district && { district }),
                date: {
                    gte: startDate,
                },
            },
            orderBy: {
                date: "asc",
            },
        }) as unknown as PriceData[];

        // Format data for Recharts
        const chartData: HistoryData[] = prices.map((p) => ({
            date: p.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            price: p.price,
            timestamp: p.date.getTime(),
            fullDate: p.date.toISOString(),
        }));

        return NextResponse.json(chartData);
    } catch (error) {
        console.error("Error fetching price history:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
