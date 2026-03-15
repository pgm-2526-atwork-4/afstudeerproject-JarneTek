"use client";

import { createQrCode } from "@/lib/helpers/cart";

type EpcTestButtonProps = {
  clubName: string;
  iban?: string | null;
};

export default function EpcTestButton({ clubName, iban }: EpcTestButtonProps) {
  const handleClick = () => {
    const hardcodedIban = iban && iban.trim().length > 0 ? iban : "BE68539007547034";
    const hardcodedAmount = 12.5;
    const hardcodedReference = "TEST-LID_U15-ORDER_123";

    const epcString = createQrCode(
      clubName,
      hardcodedIban,
      hardcodedAmount,
      hardcodedReference,
    );

    const lines = epcString.split("\n");

    console.log("[EPC TEST] Raw EPC string:\n" + epcString);
    console.log("[EPC TEST] Line checks", {
      isString: typeof epcString === "string",
      lineCount: lines.length,
      has10Lines: lines.length === 10,
      bicLineEmpty: lines[4] === "",
      purposeLineEmpty: lines[8] === "",
      ibanLine: lines[6],
      amountLine: lines[7],
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="bg-gray-100 text-brand-navy px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors"
    >
      Test EPC QR String (console)
    </button>
  );
}
