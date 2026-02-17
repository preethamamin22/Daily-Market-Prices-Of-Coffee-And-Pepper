import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// In a real app, this would be a separate microservice or scheduled task
// Here we mock fetching from an external source

async function fetchExternalPrices() {
    // Mock logic: generate random prices around a base
    const basePrices = {
        COFFEE_ARABICA: 16000,
        COFFEE_ROBUSTA: 9500,
        PEPPER: 520,
    };

    const volatility = 0.02; // 2% fluctuation

    const updates = [];

    for (const district of ["KODAGU", "HASSAN"]) {
        for (const [commodity, base] of Object.entries(basePrices)) {
            const change = (Math.random() * volatility * 2 - volatility) * base;
            const price = Math.round(base + change);

            updates.push({
                commodity,
                district,
                price,
                unit: commodity === "PEPPER" ? "KG" : "50KG",
                source: "Auto-Fetch (Mock)",
            });
        }
    }

    return updates;
}

export async function GET(request: Request) {
    // Check for a secret token in headers (simple security for cron)
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET || "cron_secret"}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const newPrices = await fetchExternalPrices();

        // Check if we already have prices for today to avoid duplicates?
        // Or just add them. For now, let's just add them.

        // Actually, good practice: Check if exists for today
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
                        ...p,
                        date: new Date(),
                    },
                });
                created.push(result);
            }
        }

        return NextResponse.json({ success: true, added: created.length, data: created });
    } catch (error) {
        console.error("Cron failed:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
