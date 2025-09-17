import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.$connect();

    const users = await prisma.user.findMany();
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
