"use server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function getClubOrders(clubId: string) {
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
    const orders = await prisma.order.findMany({
        where: {
            member: {
                clubId,
            },
        },
        include: {
            member: true,
            items: {
                include: {
                    product: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // Convert Prisma Decimal to primitive Number for Next.js Client Components
    return orders.map((order) => ({
        ...order,
        totalPrice: Number(order.totalPrice),
        items: order.items.map((item) => ({
            ...item,
            price: Number(item.price),
        })),
    }));
}

export async function createManualOrder(memberId: string, items: { productId: string; size: string; quantity: number; price: number }[], clubId: string, totalPrice: number){
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
    const order = await prisma.order.create({
        data: {
            memberId,
            totalPrice,
            items: {
                create: items.map((item) => ({
                    productId: item.productId,
                    size: item.size,
                    quantity: item.quantity,
                    price: item.price,
                })),
            },
        },
    });
    return {
        ...order,
        totalPrice: Number(order.totalPrice),
    };
}


export async function createMemberOrder(token: string, totalPrice: number, items: { productId: string; size: string; quantity: number; price: number }[]) {
    const member = await prisma.member.findUnique({
        where: {
            orderToken: token,
        },
    });
    if (!member) {
        throw new Error("No member found");
    }
    const order = await prisma.order.create({
        data: {
            memberId: member.id,
            totalPrice: totalPrice,
            items: {
                create: items.map((item) => ({
                    productId: item.productId,
                    size: item.size,
                    quantity: item.quantity,
                    price: item.price,
                })),
            },
        },
    });
    return {
        ...order,
        totalPrice: Number(order.totalPrice),
    };
}