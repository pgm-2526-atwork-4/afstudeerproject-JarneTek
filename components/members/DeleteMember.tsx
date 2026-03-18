"use client";

import { useState } from "react";
import { deleteMember } from "@/lib/actions/members";

export default function DeleteMember({
  memberId,
  onClose,
}: {
  memberId: string;
  onClose: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    const result = await deleteMember(memberId);
    if (result?.error) {
      setError(result.error);
    } else {
      setIsOpen(false);
      onClose();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
      >
        Delete
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-brand-navy mb-2">Delete Member</h2>
            <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete this member? This action cannot be undone.</p>
            {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}