"use client";

import { useState, useEffect } from "react";
import { getFormItemsForMember } from "@/lib/actions/forms";
import MemberFormItems from "@/components/members/memberFormItems";
import { getMemberFormItemsFromToken } from "@/lib/actions/members";

type FormWithItems = Awaited<ReturnType<typeof getMemberFormItemsFromToken>>;

export default function ManualOrderPopUp({
  memberId,
  clubId,
}: {
  memberId: string;
  clubId: string;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormWithItems | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && !form) {
      setLoading(true);
      getFormItemsForMember(memberId).then((data) => {
        setForm(data);
        setLoading(false);
      });
    }
  }, [open, memberId, form]);

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
            <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
                  Loading products...
                </div>
              ) : form ? (
                <MemberFormItems
                  form={form}
                  memberId={memberId}
                  clubId={clubId}
                  onSuccess={() => setOpen(false)}
                />
              ) : (
                <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
                  No form found for this member&apos;s group.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
