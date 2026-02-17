const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
    const commodities = ['COFFEE_ARABICA', 'COFFEE_ROBUSTA', 'PEPPER'];
    const districts = ['KODAGU', 'HASSAN'];

    for (const commodity of commodities) {
        for (const district of districts) {
            const count = await prisma.dailyPrice.count({
                where: { commodity, district }
            });
            console.log(`${commodity} | ${district}: ${count} records`);
        }
    }
}

checkData().catch(e => console.error(e)).finally(() => prisma.$disconnect());
