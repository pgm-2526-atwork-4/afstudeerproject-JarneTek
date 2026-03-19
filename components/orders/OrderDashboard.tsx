"use client";

import { useClub } from "@/providers/clubprovider";
import { getClubOrders, getClubFittingDays, confirmOrder, toggleOrderStatus } from "@/lib/actions/orders";
import { useState, useEffect } from "react";
import { Order, OrderItem, Member, Product, FittingDay } from "@prisma/client";
import { printOrderPDF } from "@/lib/helpers/print";
import Pagination from "@/components/pagination/pagination";


type OrderWithDetails = Omit<Order, "totalPrice"> & {
  totalPrice: number;
  member: Member;
  items: (Omit<OrderItem, "price"> & { price: number; product: Product })[];
};

export default function OrdersPage({fittingdays, initialOrders }: {fittingdays: FittingDay[], initialOrders: OrderWithDetails[]}) {
  const { selectedClub } = useClub();
  const [orders, setOrders] = useState<OrderWithDetails[]>(initialOrders);
  const [activeTab, setActiveTab] = useState<"summary" | "individual" | "pending">(
    "summary",
  );

  const [activeFittingDay, setActiveFittingDay] = useState<string | null>(null);

  const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(null);
  const [togglingOrderId, setTogglingOrderId] = useState<string | null>(null);
  const [confirmMessage, setConfirmMessage] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleConfirmOrder = async (orderId: string) => {
    setConfirmError(null);
    setConfirmMessage(null);
    setConfirmingOrderId(orderId);

    const res = await confirmOrder(orderId);
    if (res.success) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: "CONFIRMED" } : o,
        )
      );
      setConfirmMessage("The order was marked as CONFIRMED and removed from Pending Orders.");
    } else {
      setConfirmError("Could not confirm this order. Please try again.");
    }

    setConfirmingOrderId(null);
  };

  const handleSetToPending = async (orderId: string) => {
    setTogglingOrderId(orderId);
    
    const res = await toggleOrderStatus(orderId, "PENDING");
    
    if (res.error) {
      alert(res.error);
    } else {
      const updatedOrders = orders.map((order) => {
        if (order.id === orderId) {
          return { ...order, status: "PENDING" as const };
        }
        return order;
      });
      
      setOrders(updatedOrders);
    }

    setTogglingOrderId(null);
  };

  if (!selectedClub) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        No club selected.
      </div>
    );
  }

  function printPDF() {
    const selectedDay = fittingdays.find((d) => d.id === activeFittingDay);
    const title = selectedDay
      ? `Bestellingen \u2013 ${new Date(selectedDay.date).toLocaleDateString("nl-BE")}${selectedDay.location ? " \u2013 " + selectedDay.location : ""}`
      : "Bestellingen \u2013 Alle pasdagen";
    printOrderPDF({ title, summaryItems });
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
  
  const totalSummaryPages = Math.ceil(summaryItems.length / pageSize);
  const paginatedSummaryItems = summaryItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const totalIndividualPages = Math.ceil(orders.length / pageSize);
  const paginatedIndividualOrders = orders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const pendingOrders = orders.filter((o) => o.status === "PENDING");
  const totalPendingPages = Math.ceil(pendingOrders.length / pageSize);
  const paginatedPendingOrders = pendingOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-brand-navy">Order Overview</h1>
            <p className="text-gray-500 text-sm">{orders.length} orders</p>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-400">Filter by Fitting Day:</span>
            <select
              value={activeFittingDay || ""}
              onChange={(e) => setActiveFittingDay(e.target.value || null)}
              className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-brand-navy focus:border-brand-navy block p-2.5 outline-none"
            >
              <option value="">All Fitting Days</option>
              {fittingdays.map((day) => (
                <option key={day.id} value={day.id}>
                  {new Date(day.date).toLocaleDateString('nl-BE')} - {day.location}
                </option>
              ))}
            </select>
            <button
              onClick={printPDF}
              disabled={orders.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-brand-navy text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Print / PDF
            </button>
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
              Summary View
            </button>
            <button
              onClick={() => setActiveTab("individual")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "individual"
                  ? "bg-brand-navy text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              individual Orders
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "pending"
                  ? "bg-brand-navy text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Pending ({pendingOrders.length})
            </button>
          </div>
          
        {activeTab === "summary" && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {summaryItems.length === 0 ? (
              <div className="p-10 text-center text-gray-400 text-sm">
                No orders yet.
              </div>
            ) : (
              <>
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
                    {paginatedSummaryItems.map((item, i) => (
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
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalSummaryPages}
                  onPageChange={setCurrentPage}
                />
              </>
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
              paginatedIndividualOrders.map((order) => (
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
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${
                          order.status === "DELIVERED"
                            ? "bg-green-100 text-green-700"
                            : order.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {order.status}
                      </span>
                      
                      {order.status === "CONFIRMED" && (
                        <button
                          type="button"
                          disabled={togglingOrderId === order.id}
                          onClick={() => handleSetToPending(order.id)}
                          className="text-xs text-brand-navy underline hover:text-brand-green transition-colors disabled:opacity-50 disabled:no-underline"
                        >
                          {togglingOrderId === order.id ? "Updating..." : "Set to Pending"}
                        </button>
                      )}
                    </div>
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
            <Pagination 
              currentPage={currentPage}
              totalPages={totalIndividualPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
        {activeTab === "pending" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Click <span className="font-medium text-brand-navy">Set to confirmed</span> to change an order from pending to confirmed.
            </p>

            {confirmMessage && (
              <div className="text-sm text-green-700">
                {confirmMessage}
              </div>
            )}

            {confirmError && (
              <div className="text-sm text-red-600">
                {confirmError}
              </div>
            )}

            {pendingOrders.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-200 rounded-xl p-10 text-center text-gray-400 text-sm">
                No pending orders left to confirm.
              </div>
            ) : (
              paginatedPendingOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl border border-gray-200 bg-white p-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-medium text-brand-navy">
                        {order.member.firstName} {order.member.lastName}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Order #{order.orderNumber}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Total: €{Number(order.totalPrice).toFixed(2)}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <button
                        type="button"
                        onClick={() => handleConfirmOrder(order.id)}
                        disabled={confirmingOrderId === order.id}
                        className="mt-3 inline-flex items-center justify-center rounded-lg border border-brand-navy bg-brand-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-navy-light hover:border-brand-navy-light disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {confirmingOrderId === order.id ? "Confirming..." : "Set to confirmed"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <ul className="space-y-1 text-sm text-gray-600">
                      {order.items.map((item) => (
                        <li key={item.id} className="flex items-center justify-between gap-4 text-gray-600">
                          <span>
                            {item.quantity}x {item.product.name} ({item.size})
                          </span>
                          <span>
                            €{(Number(item.price) * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))
            )}
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPendingPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
