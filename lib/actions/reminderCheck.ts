"use server"

import { prisma } from "@/lib/db";
import { sendReminderEmail } from "./email";

export async function reminderCheck() {
    const now = new Date();
    const fittingDays = await prisma.fittingDay.findMany({
        where: {
            date: {
                gte: now,
            },
            reminderSent: false,
        },
    });


    for (const fittingDay of fittingDays) {
        if (fittingDay.reminderSent) continue;

        const timeDiff = fittingDay.date.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        if (hoursDiff < 23 || hoursDiff > 25) continue;

        const club = await prisma.club.findUnique({
            where: { id: fittingDay.clubId },
        });

        if (!club) continue;

        const members = await prisma.member.findMany({
            where: {
                clubId: club.id,
                group: {
                    in: fittingDay.targetGroups,
                },
            },
            orderBy: {
                id: 'asc',
            },
        });

        for (const member of members) {
            await sendReminderEmail(
                member.email,
                member.firstName,
                club.name,
                fittingDay.date.toLocaleDateString('nl-BE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
                fittingDay.startTime,
                fittingDay.endTime,
                fittingDay.location,
                member.orderToken
            );
        }

        await prisma.fittingDay.update({
            where: { id: fittingDay.id },
            data: { reminderSent: true },
        });
    }
}