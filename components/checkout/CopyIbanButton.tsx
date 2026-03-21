"use client";

import { useState } from "react";

export default function CopyIbanButton({ iban }: { iban: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(iban.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 bg-brand-navy text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-brand-navy/90 transition-all shadow-md"
    >
      {copied ? "✅ IBAN Copied!" : "📋 Copy IBAN to pay via your banking app"}
    </button>
  );
}
