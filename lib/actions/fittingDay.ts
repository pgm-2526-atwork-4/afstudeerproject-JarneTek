"use server";

import crypto from "crypto";
import { prisma } from "@/lib/db";
import { sendOrderLinkEmail } from "./email";

export async function startFittingDay(clubId: string, formId: string, formData: FormData) {
    const club = await prisma.club.findUnique({
        where: { id: clubId },
    });
    if (!club) {
        throw new Error("Club not found");
    }

    const form = await prisma.form.findUnique({
        where: { id: formId },
    });
    if (!form) {
        throw new Error("Form not found");
    }

    const members = await prisma.member.findMany({
        where: {
            clubId,
            group: {
                in: form.targetGroups,
            },
        },
    });

    const fittingDay = await prisma.fittingDay.create({
        data: {
            clubId,
            date: new Date(formData.get("date") as string),
            startTime: formData.get("startTime") as string,
            endTime: formData.get("endTime") as string,
            location: formData.get("location") as string,
            targetGroups: form.targetGroups,
        },
    });

    for (const member of members) {
        const token = crypto.randomUUID();

        await prisma.member.update({
            where: { id: member.id },
            data: { orderToken: token, fittingDayId: fittingDay.id },
        });

        const orderLink = `${process.env.NEXT_PUBLIC_APP_URL}/order/${token}`;
        const formattedDate = fittingDay.date.toLocaleDateString('nl-BE', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        await sendOrderLinkEmail(orderLink, club.name, fittingDay.startTime, fittingDay.endTime, formattedDate);
    }
    return fittingDay;

}