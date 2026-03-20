"use client";
 
import { useState } from "react";
import Pagination from "../pagination/pagination";
import SearchBar from "../ui/SearchBar";
import { OrderWithDetails } from "@/types/orders";
 
interface IndividualOrdersViewProps {
  orders: OrderWithDetails[];
  handleSetToPending: (orderId: string) => void;
  togglingOrderId: string | null;
}
 
export default function IndividualOrdersView({
  orders,
  handleSetToPending,
  togglingOrderId,
}: IndividualOrdersViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 10;
 
  const filteredOrders = orders.filter((order) => {
    const fullName = `${order.member.firstName} ${order.member.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
 
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <SearchBar
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(val) => {
            setSearchQuery(val);
            setCurrentPage(1);
          }}
          className="w-full sm:w-64"
        />
      </div>
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-xl p-10 text-center text-gray-400 text-sm">
          No orders yet.
        </div>
      ) : (
        <>
          {paginatedOrders.map((order) => (
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
                  {order.status === "CONFIRMED" && (
                    <button
                      onClick={() => handleSetToPending(order.id)}
                      disabled={togglingOrderId === order.id}
                      className="text-xs text-brand-navy underline hover:text-brand-green disabled:opacity-50"
                    >
                      {togglingOrderId === order.id
                        ? "Updating..."
                        : "Set to Pending"}
                    </button>
                  )}
                </div>
              </div>
              <table className="w-full text-sm text-gray-600">
                <thead>
                  <tr className="text-left text-gray-400 text-xs">
                    <th className="py-1">Article</th>
                    <th className="py-1">Size</th>
                    <th className="py-1">Qty</th>
                    <th className="py-1 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-1">{item.product.name}</td>
                      <td className="py-1">{item.size}</td>
                      <td className="py-1">{item.quantity}x</td>
                      <td className="py-1 text-right">
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
          ))}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}