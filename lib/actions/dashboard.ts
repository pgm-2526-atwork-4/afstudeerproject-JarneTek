"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function getDashboardStats(clubId: string) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const clubUser = await prisma.clubUser.findUnique({
    where: { userId_clubId: { userId: session.id, clubId } },
  });
  if (!clubUser) return null;

  // Run all independent queries in parallel
  const [
    totalMembers,
    unpaidMembers,
    activeForms,
    fittingDay,
    pendingOrders,
    totalCollectedAgg,
    recentOrders,
    club,
  ] = await Promise.all([
    prisma.member.count({ where: { clubId } }),
    prisma.member.count({ where: { clubId, hasPaid: false } }),
    prisma.form.count({ where: { clubId, isActive: true } }),
    prisma.fittingDay.findFirst({
      where: { clubId },
      orderBy: { date: "desc" },
    }),
    prisma.order.count({
      where: { member: { clubId }, status: "PENDING" },
    }),
    prisma.order.aggregate({
      where: { member: { clubId } },
      _sum: { totalPrice: true },
    }),
    prisma.order.findMany({
      where: { member: { clubId } },
      include: {
        member: { select: { firstName: true, lastName: true, group: true } },
        items: { select: { quantity: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.club.findUnique({
      where: { id: clubId },
      select: { name: true },
    }),
  ]);

  return {
    clubName: club?.name ?? "",
    totalMembers,
    unpaidMembers,
    activeForms,
    pendingOrders,
    totalCollected: Number(totalCollectedAgg._sum.totalPrice ?? 0),
    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      memberName: `${o.member.firstName} ${o.member.lastName}`,
      group: o.member.group,
      totalPrice: Number(o.totalPrice),
      status: o.status,
      itemCount: o.items.reduce((sum, i) => sum + i.quantity, 0),
    })),
    fittingDay: fittingDay
      ? {
          date: fittingDay.date.toISOString(),
          startTime: fittingDay.startTime,
          endTime: fittingDay.endTime,
          location: fittingDay.location,
          isUpcoming: fittingDay.date >= new Date(),
        }
      : null,
  };
}
