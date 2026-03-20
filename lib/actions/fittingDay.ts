"use server";

import crypto from "crypto";
import { prisma } from "@/lib/db";
import { sendOrderLinkEmail } from "./email";
import { startFittingDaySchema } from "../validations/fittingDay";

export async function startFittingDay(clubId: string, formId: string, formData: FormData) {

    const validated = startFittingDaySchema.safeParse({
        date: formData.get("date"), 
        startTime: formData.get("startTime"), 
        endTime: formData.get("endTime"), 
        location: formData.get("location")
    });
    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }

    const club = await prisma.club.findUnique({
        where: { id: clubId },
    });
    if (!club) {
        return { error: "Club not found" };
    }

    const form = await prisma.form.findUnique({
        where: { id: formId },
    });
    if (!form) {
        return { error: "Form not found" };
    }

    const members = await prisma.member.findMany({
        where: {
            clubId,
            group: {
                in: form.targetGroups,
            },
        },
        orderBy: {
            id: 'asc',
        },
    });

    if (members.length === 0) {
        return { error: "No members found for the selected form" };
    }

    const fittingDay = await prisma.fittingDay.create({
        data: {
            clubId,
            date: new Date(validated.data.date),
            startTime: validated.data.startTime,
            endTime: validated.data.endTime,
            location: validated.data.location,
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

        await sendOrderLinkEmail(orderLink, member.email, club.name, fittingDay.startTime, fittingDay.endTime, formattedDate);
    }
    return { success: "Fitting day started successfully", fittingDay };

}