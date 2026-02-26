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
