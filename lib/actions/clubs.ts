"use server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClubSchema } from "@/lib/validations/clubs";

export async function getUserClubs() {
    const session = await getSession();
    if (!session) {
        throw new Error("No session found");
    }
    const clubs = await prisma.clubUser.findMany({
        where: {
            userId: session.id,
        },
        include: {
            club: true,
        },
    });

    return clubs;
}

export async function createClub(formData: FormData): Promise<{ error: string } | void> {
    const session = await getSession();
    if (!session) return { error: "Not authenticated" };

    const parsed = createClubSchema.safeParse({
        name: formData.get("name"),
        primaryColor: formData.get("primaryColor"),
        secondaryColor: formData.get("secondaryColor") || undefined,
        iban: formData.get("iban") || undefined,
    });
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const { name, primaryColor, secondaryColor } = parsed.data;
    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const club = await prisma.club.create({
        data: {
            name,
            slug,
            primaryColor,
            secondaryColor,
        },
    });
    await prisma.clubUser.create({
        data: {
            userId: session.id,
            clubId: club.id,
            role: "OWNER",
        },
    });
    revalidatePath("/dashboard");
    redirect("/dashboard");
}

export async function updateClub(clubId: string, formData: FormData) {
    const session = await getSession();
    if (!session) return { error: "Not authenticated" };

    const clubUser = await prisma.clubUser.findUnique({
        where: {
            userId_clubId: {
                userId: session.id,
                clubId,
            },
        },
    });
    if (!clubUser) return { error: "Not authorized" };

    const parsed = createClubSchema.safeParse({
        name: formData.get("name"),
        primaryColor: formData.get("primaryColor"),
        secondaryColor: formData.get("secondaryColor") || undefined,
        iban: formData.get("iban") || undefined,
    });
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const slug = parsed.data.name.toLowerCase().replace(/\s+/g, "-");

    await prisma.club.update({
        where: { id: clubId },
        data: {
            name: parsed.data.name,
            slug,
            primaryColor: parsed.data.primaryColor,
            secondaryColor: parsed.data.secondaryColor,
            iban: parsed.data.iban,
        },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/club-info");
    return { success: true };
}
