"use server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getClubOrders(clubId: string, fittingDayId?: string) {
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
            fittingDayId,
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
            id: 'desc',
        },
    });

    return orders.map((order) => ({
        ...order,
        totalPrice: Number(order.totalPrice),
        items: order.items.map((item) => ({
            ...item,
            price: Number(item.price),
        })),
    }));
}

export async function createManualOrder(memberId: string, items: { productId: string; size: string; quantity: number; price: number }[], clubId: string, totalPrice: number) {
    const session = await getSession();
    if (!session) {
        return { error: "No session found" };
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
        return { error: "Not authorized" };
    }
    if (items.length === 0) {
        return { error: "Add at least one item to the order" };
    }
    if (totalPrice < 0) {
        return { error: "Invalid total price" };
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
        success: true,
        order: { ...order, totalPrice: Number(order.totalPrice) },
    };
}

export async function createMemberOrder(token: string, totalPrice: number, items: { productId: string; size: string; quantity: number; price: number }[]) {
    const member = await prisma.member.findUnique({
        where: {
            orderToken: token,
        },
    });
    if (!member) {
        return { error: "Invalid or expired order link" };
    }

    if (items.length === 0) {
        return { error: "No items selected" };
    }

    const existingOrder = await prisma.order.findFirst({
        where: {
            memberId: member.id,
            fittingDayId: member.fittingDayId,
        },
    });
    if (existingOrder) {
        return { error: "You have already placed an order for this fitting day" };
    }

    const order = await prisma.order.create({
        data: {
            memberId: member.id,
            totalPrice: totalPrice,
            fittingDayId: member.fittingDayId,
            status: totalPrice === 0 ? 'CONFIRMED' : 'PENDING',
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
        success: true,
        order: { ...order, totalPrice: Number(order.totalPrice) },
    };
}

export async function getClubFittingDays(clubId: string) {
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
    const fittingDays = await prisma.fittingDay.findMany({
        where: {
            clubId,
        },
        orderBy: {
            date: 'desc'
        }
    });
    return fittingDays;
}

export async function confirmOrder(orderId: string){
try {
    await prisma.order.updateMany({
      where: {
        id: orderId,
        status: "PENDING", 
      },
      data: {
        status: "CONFIRMED",
      },
    });

    revalidatePath("/dashboard/order-overview");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function toggleOrderStatus(orderId: string, newStatus: "PENDING" | "CONFIRMED") {
    const session = await getSession();
    if (!session) {
        return { error: "No session found" };
    }

    try {
        await prisma.order.update({
            where: {
                id: orderId,
            },
            data: {
                status: newStatus,
            },
        });

        revalidatePath("/dashboard/order-overview");
        return { success: true };
    } catch (error) {
        console.error("Failed to toggle order status:", error);
        return { error: "Failed to update order status" };
    }
}