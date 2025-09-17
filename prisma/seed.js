const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function main() {
    // ❌ verwijder alleen oude conversaties, niet jouw user
    await prisma.message.deleteMany();
    await prisma.conversationParticipant.deleteMany();
    await prisma.conversation.deleteMany();

    // ✅ jouw eigen account ophalen (pas je email hier aan!)
    const me = await prisma.user.findFirst({
        where: { email: process.env.MY_EMAIL }, // <-- zet hier jouw eigen email
    });

    if (!me) {
        throw new Error(
            "⚠️ Geen bestaande user gevonden. Pas het e-mailadres in seed.js aan!"
        );
    }

    // 👥 10 fake users toevoegen
    const fakeUsers = [];
    for (let i = 0; i < 10; i++) {
        const user = await prisma.user.upsert({
            where: { email: `testuser${i}@example.com` },
            update: {},
            create: {
                name: faker.person.fullName(),
                email: `testuser${i}@example.com`,
                image: faker.image.avatarGitHub(),
            },
        });
        fakeUsers.push(user);
    }

    // 🔄 voor elke fake user een 1-op-1 conversatie met jou + faker berichten
    for (const user of fakeUsers) {
        const conversation = await prisma.conversation.create({
            data: {
                participants: {
                    create: [{ userId: me.id }, { userId: user.id }],
                },
            },
        });

        const messageCount = faker.number.int({ min: 15, max: 25 });
        const messages = Array.from({ length: messageCount }).map(() => {
            const sender = faker.helpers.arrayElement([me.id, user.id]);
            return {
                senderId: sender,
                conversationId: conversation.id,
                content: faker.lorem.sentence(),
                createdAt: faker.date.recent({ days: 14 }),
            };
        });

        await prisma.message.createMany({ data: messages });
    }

    // 👥 een paar groepsconversaties maken
    for (let g = 0; g < 3; g++) {
        // kies 3-5 random users uit de lijst
        const groupMembers = faker.helpers.arrayElements(
            fakeUsers,
            faker.number.int({ min: 3, max: 5 })
        );
        // altijd jouzelf erbij
        groupMembers.push(me);

        const groupConversation = await prisma.conversation.create({
            data: {
                participants: {
                    create: groupMembers.map((u) => ({ userId: u.id })),
                },
            },
        });

        // faker berichten voor de groep
        const groupMessageCount = faker.number.int({ min: 20, max: 40 });
        const groupMessages = Array.from({ length: groupMessageCount }).map(
            () => {
                const sender = faker.helpers.arrayElement(groupMembers).id;
                return {
                    senderId: sender,
                    conversationId: groupConversation.id,
                    content: faker.hacker.phrase(),
                    createdAt: faker.date.recent({ days: 10 }),
                };
            }
        );

        await prisma.message.createMany({ data: groupMessages });
    }
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        await prisma.$disconnect();
        process.exit(1);
    });
