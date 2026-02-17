const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('admin123', 10);

    // Upsert Admin User
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Admin User',
            password,
            role: 'ADMIN',
        },
    });

    console.log({ admin });

    // Add some sample prices
    const prices = [
        { commodity: 'COFFEE_ARABICA', district: 'KODAGU', price: 16000, unit: '50KG', source: 'Market' },
        { commodity: 'COFFEE_ROBUSTA', district: 'KODAGU', price: 9500, unit: '50KG', source: 'Market' },
        { commodity: 'PEPPER', district: 'KODAGU', price: 520, unit: 'KG', source: 'Market' },
        { commodity: 'COFFEE_ARABICA', district: 'HASSAN', price: 15800, unit: '50KG', source: 'Market' },
        { commodity: 'COFFEE_ROBUSTA', district: 'HASSAN', price: 9400, unit: '50KG', source: 'Market' },
        { commodity: 'PEPPER', district: 'HASSAN', price: 515, unit: 'KG', source: 'Market' },
    ];

    for (const p of prices) {
        await prisma.dailyPrice.create({
            data: p,
        });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
