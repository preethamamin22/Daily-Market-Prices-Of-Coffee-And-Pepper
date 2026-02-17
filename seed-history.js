const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
    const commodities = ['COFFEE_ARABICA', 'COFFEE_ROBUSTA', 'PEPPER'];
    const districts = ['KODAGU', 'HASSAN'];
    const basePrices = {
        'COFFEE_ARABICA': 15000,
        'COFFEE_ROBUSTA': 8000,
        'PEPPER': 60000
    };

    const now = new Date();

    for (const commodity of commodities) {
        for (const district of districts) {
            const base = basePrices[commodity];

            // Create data for last 30 days
            for (let i = 30; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                date.setHours(0, 0, 0, 0);

                // Random volatility to show "up" and "down"
                const volatility = (Math.random() - 0.5) * 0.05; // +/- 2.5%
                const price = Math.round(base * (1 + (i * 0.002) + volatility));

                await prisma.dailyPrice.upsert({
                    where: {
                        date_commodity_district: {
                            date,
                            commodity,
                            district
                        }
                    },
                    update: { price },
                    create: {
                        date,
                        commodity,
                        district,
                        price,
                        unit: commodity === 'PEPPER' ? 'QUINTAL' : '50KG',
                        source: 'Agmarknet Live',
                    }
                });
            }
        }
    }
    console.log("Seeding completed successfully!");
}

seed()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
