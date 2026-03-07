"use client";

import { sendTestEmail } from "@/lib/actions/email";
import { useState } from "react";

export default function TestEmailButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await sendTestEmail();
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="bg-brand-navy text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-green transition-colors"
    >
      {loading ? "Sending..." : "Send Test Email"}
    </button>
  );
}