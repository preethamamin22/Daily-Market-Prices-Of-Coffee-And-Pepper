import { NextResponse } from "next/server";
import { fetchLatestPrices } from "@/lib/scraper";
import { prisma } from "@/lib/db";

export async function GET() {
    try {
        const prices = await fetchLatestPrices();

        // Optional: Save to DB if it's the first fetch of the day
        // For now, just return the "live" prices

        return NextResponse.json(prices);
    } catch (error) {
        console.error("Error in prices API:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST() {
    try {
        const prices = await fetchLatestPrices();

        // Save to database with upsert to avoid unique constraint errors
        const created = await Promise.all(
            prices.map(p => prisma.dailyPrice.upsert({
                where: {
                    date_commodity_district: {
                        date: new Date(new Date(p.date || new Date()).setHours(0, 0, 0, 0)),
                        commodity: p.commodity,
                        district: p.district,
                    }
                },
                update: {
                    price: p.price,
                    unit: p.unit,
                    source: p.source,
                    updatedAt: new Date(),
                },
                create: {
                    commodity: p.commodity,
                    district: p.district,
                    price: p.price,
                    unit: p.unit,
                    source: p.source,
                    date: new Date(new Date(p.date || new Date()).setHours(0, 0, 0, 0)),
                }
            }))
        );

        return NextResponse.json({ success: true, count: created.length });
    } catch (error) {
        console.error("Error updating prices:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
