import { prisma } from "@/lib/db";
import { createQrCode } from "@/lib/helpers/cart";
import { Decimal } from "@prisma/client/runtime/library";
import { QRCodeSVG } from "qrcode.react";
import CopyIbanButton from "@/components/checkout/CopyIbanButton";

export default async function CheckoutSuccessPage({searchParams}: {searchParams: {token?: string, orderId?: string}}) {

    const orderId = searchParams.orderId;
    const token = searchParams.token;

  if (!orderId || !token) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Invalid Order</h1>
          <p className="text-gray-500 mt-2">
            No order ID or token provided. Please contact support if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      member: { include: { club: true } },
    },
  });

  if (!order || order.member.orderToken !== token) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">  
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Order Not Found</h1>
          <p className="text-gray-500 mt-2">
            No order found with the provided ID and token. Please contact support if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  const clubName = order.member.club.name;
  const iban = order.member.club.iban;
  const memberName = `${order.member.firstName} ${order.member.lastName}`.trim();
  const totalAmount = order.totalPrice as Decimal;
  const reference = `member: ${memberName} | order: ${orderId}`;
  const formattedTotal = Number(order.totalPrice).toFixed(2);

  const qrCode = iban ? createQrCode(clubName, iban, totalAmount, reference) : null;

  if (formattedTotal === "0.00") {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-500">Order Successful</h1>
          <p className="text-gray-500 mt-2">
            Your order has been placed successfully. No payment is required for this order.
          </p>
        </div>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-brand-navy">Checkout Successful</h1>
        {qrCode ? (
          <>
            <p className="text-gray-500 mt-2">
              Scan this QR code in your banking app to complete payment.
            </p>
            <div className="mt-6">
              <div className="inline-flex rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <QRCodeSVG value={qrCode} size={240} includeMargin />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              On mobile? Copy the IBAN and pay via your banking app.
            </p>
            <div className="mt-3">
              <CopyIbanButton iban={iban!} />
            </div>
            <div className="mt-6 space-y-1 text-sm text-gray-600">
              <p>Club: {clubName}</p>
              <p>Amount: EUR {formattedTotal}</p>
              <p>IBAN: {iban}</p>
              <p className="break-all">Reference: {reference}</p>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 mt-2">Your order has been placed successfully.</p>
            <p className="mt-4 text-sm text-gray-700">
              Pay EUR {formattedTotal} cash to your trainer or club admin.
            </p>
          </>
        )}
      </div>
    </div>
  );
}