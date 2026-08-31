/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function reset() {
    const email = 'preetham@example.com';
    const name = 'Preetham';
    const plainPassword = 'Preetham@22';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    console.log(`Setting admin credentials for ${email}`);
    console.log(`Name: ${name}`);
    console.log(`Password: ${plainPassword}`);

    // Upsert Preetham user
    await prisma.user.upsert({
        where: { email },
        update: {
            name,
            password: hashedPassword,
            role: 'ADMIN',
        },
        create: {
            email,
            name,
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    // Also update admin@example.com if exists to allow smooth login
    try {
        await prisma.user.upsert({
            where: { email: 'admin@example.com' },
            update: {
                name: 'Preetham',
                password: hashedPassword,
                role: 'ADMIN',
            },
            create: {
                email: 'admin@example.com',
                name: 'Preetham',
                password: hashedPassword,
                role: 'ADMIN',
            },
        });
    } catch (e) {
        console.log('admin@example.com update skipped:', e.message);
    }

    console.log('✅ Admin credentials updated successfully to Preetham / Preetham@22');
}

reset().catch(console.error).finally(() => prisma.$disconnect());
