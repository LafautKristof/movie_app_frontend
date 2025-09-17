import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // Alle conversaties zonder owner ophalen
    const conversations = await prisma.conversation.findMany({
        where: { ownerId: null },
        include: {
            participants: {
                include: {
                    user: {
                        select: { id: true, name: true },
                    },
                },
            },
        },
    });

    for (const convo of conversations) {
        if (convo.participants.length > 0) {
            const firstParticipant = convo.participants[0];
            await prisma.conversation.update({
                where: { id: convo.id },
                data: { ownerId: firstParticipant.userId },
            });
            console.log(
                `✅ Conversation ${convo.id} owner set to ${firstParticipant.userId}`
            );
        } else {
            console.log(`⚠️ Conversation ${convo.id} heeft geen participants`);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
