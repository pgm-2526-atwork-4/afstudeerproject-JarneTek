"use client";

import { useClub } from "@/providers/clubprovider";
import { getClubOrders, getClubFittingDays } from "@/lib/actions/orders";
import { useState, useEffect } from "react";
import { Order, OrderItem, Member, Product, FittingDay } from "@prisma/client";

type OrderWithDetails = Omit<Order, "totalPrice"> & {
  totalPrice: number;
  member: Member;
  items: (Omit<OrderItem, "price"> & { price: number; product: Product })[];
};

export default function OrdersPage() {
  const { selectedClub } = useClub();
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [activeTab, setActiveTab] = useState<"summary" | "individual">(
    "summary",
  );
  const [activeFittingDay, setActiveFittingDay] = useState<string | null>(null);
  const [fittingDays, setFittingDays] = useState<FittingDay[]>([]);

  useEffect(() => {
    if (selectedClub) {
      getClubFittingDays(selectedClub.clubId).then((data) =>
        setFittingDays(data as FittingDay[]),
      );
    }
  }, [selectedClub]);

  useEffect(() => {

    if (selectedClub && activeFittingDay) {
      getClubOrders(selectedClub.clubId, activeFittingDay).then((data) =>
        setOrders(data as OrderWithDetails[]),
      );
    } else if (selectedClub) {
      getClubOrders(selectedClub.clubId).then((data) =>
        setOrders(data as OrderWithDetails[]),
      );
    }
  }, [selectedClub, activeFittingDay]);

  if (!selectedClub) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        No club selected.
      </div>
    );
  }

  const summaryItems: {
    productName: string;
    size: string;
    quantity: number;
    totalPrice: number;
  }[] = [];
  orders.forEach((order) => {
    order.items.forEach((item) => {
      const existing = summaryItems.find(
        (s) => s.productName === item.product.name && s.size === item.size,
      );
      if (existing) {
        existing.quantity += item.quantity;
        existing.totalPrice += Number(item.price) * item.quantity;
      } else {
        summaryItems.push({
          productName: item.product.name,
          size: item.size,
          quantity: item.quantity,
          totalPrice: Number(item.price) * item.quantity,
        });
      }
    });
  });

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-brand-navy">Order Overview</h1>
            <p className="text-gray-500 text-sm">{orders.length} orders</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Filter by Fitting Day:</span>
            <select
              value={activeFittingDay || ""}
              onChange={(e) => setActiveFittingDay(e.target.value || null)}
              className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-brand-navy focus:border-brand-navy block p-2.5 outline-none"
            >
              <option value="">All Fitting Days</option>
              {fittingDays.map((day) => (
                <option key={day.id} value={day.id}>
                  {new Date(day.date).toLocaleDateString('nl-BE')} - {day.location}
                </option>
              ))}
            </select>
          </div>
        </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("summary")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "summary"
                  ? "bg-brand-navy text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Artikel Samenvatting
            </button>
            <button
              onClick={() => setActiveTab("individual")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "individual"
                  ? "bg-brand-navy text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Individuele Bestellingen
            </button>
          </div>
          
        {activeTab === "summary" && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {summaryItems.length === 0 ? (
              <div className="p-10 text-center text-gray-400 text-sm">
                No orders yet.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-left text-brand-navy">
                    <th className="px-4 py-3 font-semibold">Article</th>
                    <th className="px-4 py-3 font-semibold">Size</th>
                    <th className="px-4 py-3 font-semibold">Total Quantity</th>
                    <th className="px-4 py-3 font-semibold">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryItems.map((item, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-brand-navy">
                        {item.productName}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{item.size}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {item.quantity}x
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {item.totalPrice.toFixed(2)} EUR
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "individual" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-200 rounded-xl p-10 text-center text-gray-400 text-sm">
                No orders yet.
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-brand-navy">
                        {order.member.firstName} {order.member.lastName}
                      </p>
                      <p className="text-xs text-gray-400">
                        Order #{order.orderNumber}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        order.status === "DELIVERED"
                          ? "bg-green-100 text-green-700"
                          : order.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-400 text-xs">
                        <th className="py-1">Article</th>
                        <th className="py-1">Size</th>
                        <th className="py-1">Qty</th>
                        <th className="py-1">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.id} className="text-gray-600">
                          <td className="py-1">{item.product.name}</td>
                          <td className="py-1">{item.size}</td>
                          <td className="py-1">{item.quantity}x</td>
                          <td className="py-1">
                            {Number(item.price).toFixed(2)} EUR
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-right text-sm font-semibold text-brand-navy">
                    Total: {Number(order.totalPrice).toFixed(2)} EUR
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
