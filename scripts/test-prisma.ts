import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Connecting...");
    await prisma.$connect();
    console.log("Connected!");
    const users = await prisma.user.findMany();
    console.log("Users:", users);
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
