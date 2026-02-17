const { prisma } = require('./src/lib/db.ts');

async function test() {
    try {
        console.log('Testing database connection...');
        const userCount = await prisma.user.count();
        console.log('✓ Users:', userCount);

        const priceCount = await prisma.dailyPrice.count();
        console.log('✓ Prices:', priceCount);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayPrices = await prisma.dailyPrice.findMany({
            where: { date: { gte: today } }
        });
        console.log('✓ Today prices:', todayPrices.length);

        console.log('\nAll looks good!');
    } catch (error) {
        console.error('✗ Error:', error.message);
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

test();
