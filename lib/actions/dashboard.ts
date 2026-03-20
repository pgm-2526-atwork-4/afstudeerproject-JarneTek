"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function getDashboardStats(clubId: string) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const clubUser = await prisma.clubUser.findUnique({
    where: { userId_clubId: { userId: session.id, clubId } },
  });
  if (!clubUser) throw new Error("Not authorized");

  const totalMembers = await prisma.member.count({ where: { clubId } });
  const unpaidMembers = await prisma.member.count({ where: { clubId, hasPaid: false } });
  const activeForms = await prisma.form.count({ where: { clubId, isActive: true } });
  const fittingDay = await prisma.fittingDay.findFirst({ where: { clubId }, orderBy: { date: "desc" } });

  const orders = await prisma.order.findMany({
    where: { member: { clubId } },
    include: { member: true, items: true },
    orderBy: { id: "desc" },
    take: 5,
  });

  

  return {
    totalMembers,
    unpaidMembers,
    activeForms,
    pendingOrders: orders.filter((o) => o.status === "PENDING").length,
    totalRevenue: orders.reduce((sum, o) => sum + Number(o.totalPrice), 0),
    recentOrders: orders.map((o) => ({
      id: o.id,
      memberName: `${o.member.firstName} ${o.member.lastName}`,
      group: o.member.group,
      totalPrice: Number(o.totalPrice),
      status: o.status,
      itemCount: o.items.reduce((sum, i) => sum + i.quantity, 0),
    })),
    fittingDay: fittingDay ? {
      date: fittingDay.date.toISOString(),
      startTime: fittingDay.startTime,
      endTime: fittingDay.endTime,
      location: fittingDay.location,
      isUpcoming: fittingDay.date >= new Date(),
    } : null,
  };
}
