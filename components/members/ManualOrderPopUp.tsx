"use client";

import { useState, useEffect } from "react";
import { getFormItemsForMember } from "@/lib/actions/forms";
import { createManualOrder } from "@/lib/actions/orders";
import { Product } from "@prisma/client";

export default function ManualOrderPopUp({
  memberId,
  clubId,
}: {
  memberId: string;
  clubId: string;
}) {
  const [open, setOpen] = useState(false);
  const [formItems, setFormItems] = useState<Product[]>([]);
  const [selectedItems, setSelectedItems] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [size, setSize] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getFormItemsForMember(memberId).then((data) =>
      setFormItems(data?.items.map((item) => item.product) || []),
    );
  }, [memberId]);
  useEffect(() => {
    setTotalPrice(
      selectedItems.reduce(
        (acc, item) => acc + item.defaultPrice * (quantity[item.id] || 1),
        0,
      ),
    );
  }, [selectedItems, quantity]);

  const handleCreateOrder = async () => {
    setLoading(true);
    const orderItems = selectedItems.map((item) => ({
      productId: item.id,
      size: size[item.id] || item.sizes[0] || "", // Default to first available size if not explicitly selected
      quantity: quantity[item.id] || 1,
      price: item.defaultPrice,
    }));

    await createManualOrder(memberId, orderItems, clubId, totalPrice);
    setLoading(false);
    setOpen(false);
    setSelectedItems([]);
  };

  return (
    <div>
      <button
        className="border border-gray-200 text-gray-600 px-3 py-1 rounded-lg text-xs hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <h1>Manual Order</h1>
      </button>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-brand-navy">
                Manual Order
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-5 max-h-[60vh] overflow-y-auto space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Products
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-xl p-4 space-y-3 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-brand-navy">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-brand-navy bg-gray-50 px-2 py-0.5 rounded-md">
                        €{item.defaultPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={size[item.id] || item.sizes[0] || ""} // Default to first available size if not explicitly selected
                        onChange={(e) =>
                          setSize({ ...size, [item.id]: e.target.value })
                        }
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 transition-all"
                      >
                        <option value="">Size</option>
                        {item.sizes.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={quantity[item.id] || 1}
                        onChange={(e) =>
                          setQuantity({
                            ...quantity,
                            [item.id]: Number(e.target.value),
                          })
                        }
                        min={1}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 transition-all"
                      />
                    </div>
                    <button
                      onClick={() => setSelectedItems([...selectedItems, item])}
                      className="w-full bg-brand-navy text-white py-2 rounded-lg text-sm font-medium hover:bg-brand-green transition-colors"
                    >
                      + Add to Cart
                    </button>
                  </div>
                ))}
              </div>

              {selectedItems.length > 0 && (
                <div className="mt-2 border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Cart
                  </h3>
                  <div className="space-y-2">
                    {selectedItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-sm bg-gray-50 rounded-lg px-4 py-2"
                      >
                        <span className="text-gray-700">
                          {quantity[item.id] || 1}x {item.name}{" "}
                          <span className="text-gray-400">
                            ({size[item.id] || "No size"})
                          </span>
                        </span>
                        <span className="font-medium text-brand-navy">
                          €
                          {(
                            item.defaultPrice * (quantity[item.id] || 1)
                          ).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-bold text-brand-navy mt-3 pt-3 border-t border-gray-100 text-base">
                    <span>Total:</span>
                    <span>€{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                className="w-full bg-brand-navy text-white font-semibold py-3 rounded-xl hover:bg-brand-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCreateOrder}
                disabled={selectedItems.length === 0 || loading}
              >
                {loading ? "Processing..." : "Create Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
