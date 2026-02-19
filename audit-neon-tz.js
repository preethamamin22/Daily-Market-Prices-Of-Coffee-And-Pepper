/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function audit() {
    const utcNow = new Date();
    const istNow = new Date(utcNow.getTime() + (5.5 * 60 * 60 * 1000));

    const todayUTC = new Date(utcNow);
    todayUTC.setUTCHours(0, 0, 0, 0);

    const todayIST = new Date(istNow);
    todayIST.setUTCHours(0, 0, 0, 0); // This is still UTC 00:00 but of the IST date

    const total = await prisma.dailyPrice.count();
    const countTodayUTC = await prisma.dailyPrice.count({
        where: { date: { gte: todayUTC } }
    });

    const latest = await prisma.dailyPrice.findFirst({
        orderBy: { date: 'desc' }
    });

    console.log(`UTC Now: ${utcNow.toISOString()}`);
    console.log(`Total Records: ${total}`);
    console.log(`Records >= UTC Midnight Today: ${countTodayUTC}`);
    if (latest) {
        console.log(`Latest Record Date: ${latest.date.toISOString()}`);
    }
}

audit().catch(console.error).finally(() => prisma.$disconnect());

