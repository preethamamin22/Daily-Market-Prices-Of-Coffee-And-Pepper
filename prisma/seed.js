/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('Preetham@22', 10);

    // Upsert Admin User
    const admin = await prisma.user.upsert({
        where: { email: 'preetham@example.com' },
        update: {
            name: 'Preetham',
            password,
            role: 'ADMIN',
        },
        create: {
            email: 'preetham@example.com',
            name: 'Preetham',
            password,
            role: 'ADMIN',
        },
    });

    console.log({ admin });
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
