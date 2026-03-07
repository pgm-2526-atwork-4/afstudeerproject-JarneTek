
import {prisma} from "@/lib/db";

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
            group: {
                in: form.targetGroups,
            },
        },
    });

    const fittingDay = await prisma.fittingDay.create({
        data: {
            clubId,
            date: formData.get("date") as string,
            startTime: formData.get("startTime") as string,
            endTime: formData.get("endTime") as string,
            location: formData.get("location") as string

        },
    });
    return fittingDay;
    
}