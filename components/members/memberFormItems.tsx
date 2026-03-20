"use client";

import { getMemberFormItemsFromToken } from "@/lib/actions/members";
import KitItemCard from "../kit-builder/KitItemCard";
import { createMemberOrder, createManualOrder } from "@/lib/actions/orders";
import { calculateCartTotal, CartItem } from "@/lib/helpers/cart";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CartSection from "./cart/CartSection";
import ExtraItemsPopup from "./cart/ExtraItemsPopup";

type FormWithItems = Awaited<ReturnType<typeof getMemberFormItemsFromToken>>;

type MemberFormItemsProps = {
  form: Exclude<FormWithItems, null>;
  token?: string;
  memberId?: string;
  clubId?: string;
  onSuccess?: () => void;
  hideExtrasPopup?: boolean;
};

export default function MemberFormItems({
  form,
  token,
  memberId,
  clubId,
  onSuccess,
  hideExtrasPopup,
}: MemberFormItemsProps) {
  const [activeTab, setActiveTab] = useState<"basic" | "extra">("basic");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExtraPopup, setShowExtraPopup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleAddToCart(item: CartItem) {
    const existingIndex = cartItems.findIndex(
      (ci) => ci.id === item.id && ci.size === item.size,
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

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalPrice = calculateCartTotal(cartItems, form);
  const discount = Math.max(0, subtotal - totalPrice);

  const hasExtrasAvailable = customItems.length > 0;
  const hasExtrasInCart = cartItems.some((ci) => ci.type === "EXTRA");

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    if (!hideExtrasPopup && hasExtrasAvailable && !hasExtrasInCart) {
      setShowExtraPopup(true);
      return;
    }

    await submitOrder();
  };

  const submitOrder = async () => {
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
      router.push(
        `/checkout/success?orderId=${result.order?.id}&token=${token}`,
      );
    } else {
      const result = await createManualOrder(
        memberId!,
        items,
        clubId!,
        totalPrice,
      );
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
    <div className="pb-8">
      <div className="flex gap-3 mb-6 bg-gray-100 p-1.5 rounded-xl w-max">
        <button
          type="button"
          onClick={() => setActiveTab("basic")}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === "basic"
              ? "bg-white text-brand-navy shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Basic Items
        </button>

        {hasExtrasAvailable && (
          <button
            type="button"
            onClick={() => setActiveTab("extra")}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "extra"
                ? "bg-white text-brand-navy shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Extra Items
            <span className="bg-brand-green/20 text-brand-green text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
              Optional
            </span>
          </button>
        )}
      </div>

      {activeTab === "basic" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {basicItems.map((item) => (
              <KitItemCard onAdd={handleAddToCart} key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {activeTab === "extra" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6 text-sm text-blue-900 mb-6 shadow-sm items-start relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-400" />
            <div>
              <p className="font-bold mb-2 text-base text-brand-navy">
                Optional Extras
              </p>
              <p className="leading-relaxed text-blue-800/80">
                These are additional items on top of the basic package.{" "}
                <strong className="text-blue-900 bg-blue-100 px-1 rounded">
                  Note:
                </strong>{" "}
                these items are payable. The extra cost will be added directly
                to the total amount. You can see the calculation in the order
                overview below.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {customItems.map((item) => (
              <KitItemCard onAdd={handleAddToCart} key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
      <CartSection
        cartItems={cartItems}
        handleRemoveFromCart={handleRemoveFromCart}
        discount={discount}
        subtotal={subtotal}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
        isSubmitting={isSubmitting}
        error={error}
      />

      {showExtraPopup && (
        <ExtraItemsPopup
          setShowExtraPopup={setShowExtraPopup}
          setActiveTab={setActiveTab}
          submitOrder={submitOrder}
        />
      )}
    </div>
  );
}
