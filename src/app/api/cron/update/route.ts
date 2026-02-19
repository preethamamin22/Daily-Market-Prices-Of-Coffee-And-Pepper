import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fetchLatestPrices } from "@/lib/scraper";

export async function GET(request: Request) {
    // Check for a secret token in headers (simple security for cron)
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET || "cron_secret"}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        console.log("Starting automated price update...");
        const newPrices = await fetchLatestPrices();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const created = [];

        for (const p of newPrices) {
            const existing = await prisma.dailyPrice.findFirst({
                where: {
                    commodity: p.commodity,
                    district: p.district,
                    date: { gte: today },
                },
            });

            if (!existing) {
                const result = await prisma.dailyPrice.create({
                    data: {
                        commodity: p.commodity,
                        district: p.district,
                        price: p.price,
                        unit: p.unit,
                        source: p.source,
                        date: new Date(),
                    },
                });
                created.push(result);
            }
        }

        console.log(`Cron update complete. Added ${created.length} prices.`);
        return NextResponse.json({
            success: true,
            added: created.length,
            data: created.map(c => ({
                commodity: c.commodity,
                district: c.district,
                price: c.price
            }))
        });
    } catch (error) {
        console.error("Cron failed:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
