"use client";

import { getMemberFormItemsFromToken } from "@/lib/actions/members";
import KitItemCard from "../kit-builder/KitItemCard";
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
  const [showExtraPopup, setShowExtraPopup] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalPrice = calculateCartTotal(cartItems, form);
  const discount = Math.max(0, subtotal - totalPrice);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setError(null);
    setIsSubmitting(true);

    const items = cartItems.map((item) => ({
      productId: item.id,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
    }));

    if (token) {
      const result = await createMemberOrder(token, totalPrice, items);
      if (result.error) {
        setError(result.error);
        setIsSubmitting(false);
        return;
      }
      router.push(`/checkout/success?orderId=${result.order?.id}&token=${token}`);
    } else {
      const result = await createManualOrder(memberId!, items, clubId!, totalPrice);
      if (result.error) {
        setError(result.error);
        setIsSubmitting(false);
        return;
      }
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
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {basicItems.map((item) => (
              <KitItemCard onAdd={handleAddToCart} key={item.id} item={item} />
            ))}
          </div>
          
          <div className="flex justify-end pt-4 border-t border-gray-100">
             <button 
                onClick={() => setShowExtraPopup(true)} 
                className="bg-brand-navy text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-sm hover:bg-brand-green transition-colors"
              >
                Ik ben klaar met mijn basis items
             </button>
          </div>
        </div>
      )}

      {activeTab === "extra" && (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 mb-6 flex gap-3 shadow-sm">
            <span className="text-xl">ℹ️</span>
            <div>
              <p className="font-semibold mb-1">Optionele Extra&apos;s</p>
              <p>Dit zijn extra artikelen bovenop uw basispakket. <strong>Let op:</strong> deze items zijn niet gratis en worden direct aan uw totaalbedrag toegevoegd. U ziet de prijsberekening onderaan bij uw besteloverzicht.</p>
            </div>
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

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}        {cartItems.length === 0 ? (
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

            {discount > 0 && (
              <div className="flex items-center justify-between text-gray-500 pt-3 border-t border-gray-200 text-sm">
                <p>Subtotaal</p>
                <p>€{subtotal.toFixed(2)}</p>
              </div>
            )}
            
            {discount > 0 && (
              <div className="flex items-center justify-between text-brand-green pb-3 pt-1 text-sm font-medium">
                <p>Inbegrepen in basispakket</p>
                <p>- €{discount.toFixed(2)}</p>
              </div>
            )}

            <div className={`flex items-center justify-between font-bold text-lg text-brand-navy ${discount > 0 ? "border-t border-gray-200 pt-3" : "pt-3 border-t border-gray-200"}`}>
              <p>Te betalen</p>
              <p>€{totalPrice.toFixed(2)}</p>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="bg-brand-navy text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-brand-green transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Bestelling plaatsen..." : "Bestelling plaatsen"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Extra Items Popup */}
      {showExtraPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              🎁
            </div>
            <h3 className="text-xl font-bold text-brand-navy mb-2">
              Klaar met je basis items?
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Wil je nog optionele extra items toevoegen? Let op, deze extra artikelen zijn betalend.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowExtraPopup(false);
                  setActiveTab("extra");
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full bg-brand-navy text-white rounded-xl py-3 text-sm font-semibold hover:bg-brand-green transition-colors"
              >
                Ja, toon mij de extra artikelen
              </button>
              <button
                onClick={() => {
                  setShowExtraPopup(false);
                  document.getElementById("cart-section")?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full bg-white border border-gray-200 text-gray-700 rounded-xl py-3 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Nee, ga door naar afrekenen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

