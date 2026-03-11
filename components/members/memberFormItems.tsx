"use client";

import { getMemberFormItemsFromToken } from "@/lib/actions/members";
import KitItemCard from "../forms/KitItemCard";
import { createMemberOrder, createManualOrder } from "@/lib/actions/orders";
import { calculateCartTotal } from "@/lib/helpers/cart";
import { useState } from "react";
import { useRouter } from "next/navigation";

type FormWithItems = Awaited<ReturnType<typeof getMemberFormItemsFromToken>>;
type CartItem = {
  id: string;
  formItemId: string;
  productName: string;
  type: string;
  price: number;
  size: string;
  quantity: number;
};

// token = member zelf bestelt via link
// memberId + clubId = admin maakt manual order
type MemberFormItemsProps = {
  form: Exclude<FormWithItems, null>;
  token?: string;
  memberId?: string;
  clubId?: string;
  onSuccess?: () => void;
};

export default function MemberFormItems({ form, token, memberId, clubId, onSuccess }: MemberFormItemsProps) {
  const [activeTab, setActiveTab] = useState<"basic" | "extra">("basic");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  function handleAddToCart(item: CartItem) {
    const existingIndex = cartItems.findIndex(
      (ci) => ci.id === item.id && ci.size === item.size
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += item.quantity;
      setCartItems(updated);
    } else {
      setCartItems([...cartItems, item]);
    }
  }

  function handleRemoveFromCart(index: number) {
    setCartItems(cartItems.filter((_, i) => i !== index));
  }

  if (!form) return <div>No form found.</div>;

  const basicItems = form.items.filter((item) => item.type === "BASIC");
  const customItems = form.items.filter((item) => item.type === "EXTRA");

  const totalPrice = calculateCartTotal(cartItems, form);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsSubmitting(true);

    const items = cartItems.map((item) => ({
      productId: item.id,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
    }));

    if (token) {
      await createMemberOrder(token, totalPrice, items);
      router.refresh();
    } else {
      await createManualOrder(memberId!, items, clubId!, totalPrice);
      setCartItems([]);
      setIsSubmitting(false);
      onSuccess?.();
    }
  };

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab("basic")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "basic"
              ? "bg-brand-navy text-white"
              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          Basic
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("extra")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "extra"
              ? "bg-brand-navy text-white"
              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          Extra
        </button>
      </div>

      {activeTab === "basic" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {basicItems.map((item) => (
            <KitItemCard onAdd={handleAddToCart} key={item.id} item={item} />
          ))}
        </div>
      )}

      {activeTab === "extra" && (
        <>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800 mb-4">
            ⚠️ These are <strong>optional extra items</strong>. Any extras you
            select will be charged additionally.
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {customItems.map((item) => (
              <KitItemCard onAdd={handleAddToCart} key={item.id} item={item} />
            ))}
          </div>
        </>
      )}

      {/* Cart */}
      <div className="mt-8 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-lg font-bold text-brand-navy mb-4">
          Jouw bestelling ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
        </h3>

        {cartItems.length === 0 ? (
          <p className="text-gray-400 text-sm">
            Voeg artikelen toe aan je bestelling.
          </p>
        ) : (
          <>
            <table className="w-full text-sm mb-4">
              <thead>
                <tr className="text-left text-gray-400 text-xs border-b border-gray-100">
                  <th className="py-2">Artikel</th>
                  <th className="py-2">Maat</th>
                  <th className="py-2">Aantal</th>
                  <th className="py-2">Prijs</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={index} className="border-b border-gray-50">
                    <td className="py-2 font-medium text-gray-700">
                      {item.productName}
                    </td>
                    <td className="py-2 text-gray-500">{item.size}</td>
                    <td className="py-2 text-gray-500">{item.quantity}x</td>
                    <td className="py-2 text-gray-500">
                      €{(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="py-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveFromCart(index)}
                        className="text-red-400 hover:text-red-600 text-xs transition-colors"
                      >
                        Verwijder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <p className="font-semibold text-brand-navy">
                Totaal: €{totalPrice.toFixed(2)}
              </p>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="bg-brand-navy text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-brand-green transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Bestelling plaatsen..." : "Bestelling plaatsen"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

