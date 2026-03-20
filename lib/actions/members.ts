"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { updateMemberSchema } from "@/lib/validations/members";


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
        orderBy: {
            id: 'asc',
        },
    });
    revalidatePath(`/dashboard/form-builder`);
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
    const members = membersData
        .filter((member) => member.firstName?.trim() && member.lastName?.trim() && member.email?.trim() && member.group?.trim())
        .map((member) => {
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

export async function getMemberFormItemsFromToken(token: string) {
    const member = await prisma.member.findUnique({
        where: {
            orderToken: token,
        },
    });
    if (!member) {
        throw new Error("Member not found");
    }
    const form = await prisma.form.findFirst({
        where: {
            clubId: member.clubId,
            targetGroups: { has: member.group },
        },
        include: {
            items: {
                orderBy: { id: 'asc' },
                include: { product: true },
            },
        },
    });
    if (!form) return null;

    return {
        ...form,
        items: form.items.map((item) => ({
            ...item,
            customPrice: item.customPrice ? Number(item.customPrice) : null,
        })),
    };
}

export async function updateMember(memberId: string, data: {
    firstName: string;
    lastName: string;
    email: string;
    group: string;
}) {
    const validatedData = updateMemberSchema.safeParse(data);
    if (!validatedData.success) {
        return { error: validatedData.error.flatten().fieldErrors };
    }

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
            firstName: validatedData.data.firstName,
            lastName: validatedData.data.lastName,
            email: validatedData.data.email,
            group: validatedData.data.group,
        },
    });
    revalidatePath(`/dashboard/members`);
}

export async function deleteMember(memberId: string) {
    const session = await getSession();
    if (!session) {
        return { error: "No session found" };
    }
    const orders = await prisma.order.findMany({
        where: {
            memberId: memberId,
        },
    });

    if (orders.length > 0) {
        return { error: "Member has orders" };
    }
    const member = await prisma.member.findUnique({
        where: {
            id: memberId,
        },
    });
    if (!member) {
        return { error: "Member not found" };
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
        return { error: "Not authorized" };
    }

    await prisma.member.delete({
        where: {
            id: memberId,
        },
    });
    revalidatePath(`/dashboard/members`);
}

export async function addMember(clubId: string, data: {
    firstName: string;
    lastName: string;
    email: string;
    group: string;
}) {
    const session = await getSession();
    if (!session) {
        return { error: "No session found" };
    }
    const validatedData = updateMemberSchema.safeParse(data);
    if (!validatedData.success) {
        return { error: validatedData.error.issues[0].message };
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
        return { error: "Not authorized" };
    }

    const newMember = await prisma.member.create({
        data: {
            firstName: validatedData.data.firstName,
            lastName: validatedData.data.lastName,
            email: validatedData.data.email,
            group: validatedData.data.group,
            clubId: clubId,
        },
    });

    revalidatePath(`/dashboard/members`);
    return { success: true, member: newMember };
}

export async function getClubGroups(clubId: string) {
    const session = await getSession();
    if (!session) {
        return [];
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
    const groups = await prisma.member.findMany({
        where: {
            clubId: clubId,
        },
        select: {
            group: true,
        },
        distinct: ['group'],
    });
    return groups.map((g) => g.group).filter(Boolean).sort();
}