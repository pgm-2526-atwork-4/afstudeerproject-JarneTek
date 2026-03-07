"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

export async function getClubMembers(clubId: string) {
    const session = await getSession();
    if (!session) {
        throw new Error("No session found");
    }
    const clubUser = await prisma.clubUser.findUnique({
        where: {
            userId_clubId: {
                userId: session.id,
                clubId,
            },
        },
    });
    if (!clubUser) {
        throw new Error("Not authorized");
    }
    const members = await prisma.member.findMany({
        where: {
            clubId: clubId,
        },
    });
    return members;
}

export async function toggleHasPaid(memberId: string) {
    const session = await getSession();
    if (!session) {
        throw new Error("No session found");
    }
    const member = await prisma.member.findUnique({
        where: {
            id: memberId,
        },
    });
    if (!member) {
        throw new Error("Member not found");
    }
    const clubUser = await prisma.clubUser.findUnique({
        where: {
            userId_clubId: {
                userId: session.id,
                clubId: member.clubId,
            },
        },
    });
    if (!clubUser) {
        throw new Error("Not authorized");
    }
    await prisma.member.update({
        where: {
            id: memberId,
        },
        data: {
            hasPaid: !member.hasPaid,
        },
    });
    revalidatePath(`/dashboard/members`);
}

export async function importMembers(membersData: Record<string, string>[], clubId: string) {
    const session = await getSession();
    if (!session) {
        throw new Error("No session found");
    }
    const clubUser = await prisma.clubUser.findUnique({
        where: {
            userId_clubId: {
                userId: session.id,
                clubId: clubId,
            },
        },
    });
    if (!clubUser) {
        throw new Error("Not authorized");
    }
    const members = membersData.map((member) => {
        return {
            firstName: member.firstName,
            lastName: member.lastName,
            email: member.email,
            clubId: clubId,
            group: member.group,
            hasPaid: member.hasPaid
                ? ["true", "ja", "1", "yes"].includes(member.hasPaid.toLowerCase().trim())
                : false,
        };
    });

    await prisma.member.createMany({
        data: members,
    });
    revalidatePath(`/dashboard/members`);
}