const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkNeon() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log(`Checking for prices >= ${today.toISOString()}`);

    const total = await prisma.dailyPrice.count();
    const forToday = await prisma.dailyPrice.count({
        where: { date: { gte: today } }
    });

    const samples = await prisma.dailyPrice.findMany({
        take: 5,
        orderBy: { date: 'desc' }
    });

    console.log('--- Neon Database Audit ---');
    console.log(`Total records: ${total}`);
    console.log(`Records for today: ${forToday}`);
    console.log('Latest 5 records:');
    samples.forEach(s => {
        console.log(`${s.date.toISOString()} | ${s.commodity} | ${s.district} | ${s.price}`);
    });
}

checkNeon().catch(e => console.error(e)).finally(() => prisma.$disconnect());
