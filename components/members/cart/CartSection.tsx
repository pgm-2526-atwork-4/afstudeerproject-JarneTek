import { CartItem } from "@/lib/helpers/cart";
import LoadingButton from "@/components/ui/LoadingButton";

export default function CartSection({
  cartItems,
  handleRemoveFromCart,
  discount,
  subtotal,
  totalPrice,
  handleCheckout,
  isSubmitting,
  error,
}: {
  cartItems: CartItem[];
  handleRemoveFromCart: (index: number) => void;
  discount: number;
  subtotal: number;
  totalPrice: number;
  handleCheckout: () => void;
  isSubmitting: boolean;
  error: string | null;
}) {
  return (
    <div
      id="cart-section"
      className="mt-12 bg-white border-2 border-gray-100 rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-brand-navy flex items-center gap-2 uppercase tracking-tight">
          Your order
        </h3>
        <span className="bg-white text-gray-600 font-bold px-3 py-1 rounded-full text-xs shadow-sm border border-gray-200">
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm flex gap-2 items-center">
            <span className="font-bold">!</span> {error}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 font-medium">
              Your cart is currently empty.
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Add items from the lists above.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b-2 border-gray-50">
                    <th className="py-3 font-semibold w-1/2">Article</th>
                    <th className="py-3 font-semibold">Size</th>
                    <th className="py-3 font-semibold">Quantity</th>
                    <th className="py-3 font-semibold text-right">Price</th>
                    <th className="py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {cartItems.map((item, index) => (
                    <tr
                      key={index}
                      className="group hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 font-semibold text-brand-navy">
                        {item.productName}
                      </td>
                      <td className="py-4 text-gray-600 font-medium">
                        {item.size}
                      </td>
                      <td className="py-4 text-gray-600 font-medium">
                        {item.quantity}x
                      </td>
                      <td className="py-4 text-brand-navy font-bold text-right">
                        €{(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveFromCart(index)}
                          className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 sm:hidden">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm relative"
                >
                  <div className="flex justify-between items-start pr-10">
                    <div>
                      <h4 className="font-bold text-brand-navy leading-tight text-sm">
                        {item.productName}
                      </h4>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 font-medium">
                        <span className="bg-gray-100 px-2 py-0.5 rounded-md text-gray-700 font-bold uppercase tracking-tight">
                          {item.size}
                        </span>
                        <span>•</span>
                        <span>{item.quantity}x</span>
                      </div>
                    </div>
                    <div className="font-black text-brand-navy text-sm whitespace-nowrap">
                      €{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFromCart(index)}
                    className="absolute top-3 right-3 text-gray-300 hover:text-red-500 bg-gray-50 hover:bg-red-50 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-none"
                  >
                    <span className="text-xs font-bold leading-none">✕</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-xl p-5 space-y-3 border border-gray-100 shadow-inner">
              {discount > 0 && (
                <>
                  <div className="flex items-center justify-between text-gray-500 text-sm font-medium">
                    <p>Subtotal</p>
                    <p>€{subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between text-brand-green text-sm font-bold bg-white p-2.5 -mx-1 rounded-lg border border-gray-100">
                    <p>Included in basic package</p>
                    <p>- €{discount.toFixed(2)}</p>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between font-black text-xl text-brand-navy pt-2">
                <p>To be paid</p>
                <p>€{totalPrice.toFixed(2)}</p>
              </div>
            </div>

            <LoadingButton
              onClick={handleCheckout}
              isLoading={isSubmitting}
              loadingText="Placing order..."
              style={{
                backgroundColor: "#0f172a",
                color: "#ffffff",
                border: "none",
              }}
              className="w-full py-4 rounded-xl text-sm font-black uppercase tracking-wider hover:bg-[#1e293b] transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
            >
              Place Order
            </LoadingButton>
          </div>
        )}
      </div>
    </div>
  );
}
