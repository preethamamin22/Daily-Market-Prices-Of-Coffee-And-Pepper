/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAdmin() {
    const user = await prisma.user.findUnique({
        where: { email: 'admin@example.com' }
    });

    if (user) {
        console.log('âœ… Admin user found:');
        console.log(`Email: ${user.email}`);
        console.log(`Role: ${user.role}`);
        console.log(`Has Password: ${!!user.password}`);
        console.log(`Password Hash starts with: ${user.password.substring(0, 10)}...`);
    } else {
        console.log('âŒ Admin user NOT found in database!');
        const allUsers = await prisma.user.findMany();
        console.log(`Total users in DB: ${allUsers.length}`);
        allUsers.forEach(u => console.log(`- ${u.email} (${u.role})`));
    }
}

checkAdmin().catch(console.error).finally(() => prisma.$disconnect());

