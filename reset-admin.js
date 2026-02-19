/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function reset() {
    const email = 'admin@example.com';
    const plainPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    console.log(`Resetting admin password for ${email}`);
    console.log(`New Plain: ${plainPassword}`);
    console.log(`New Hash: ${hashedPassword}`);

    await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
    });

    console.log('âœ… Admin password reset successfully!');
}

reset().catch(console.error).finally(() => prisma.$disconnect());

