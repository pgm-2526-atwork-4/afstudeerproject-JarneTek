"use client";

import { useState } from "react";
import { deleteMember } from "@/lib/actions/members";
import LoadingButton from "../ui/LoadingButton";

export default function DeleteMember({
  memberId,
  onClose,
}: {
  memberId: string;
  onClose: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteMember(memberId);
    setIsDeleting(false);
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
            <h2 className="text-xl font-semibold text-brand-navy mb-2">
              Delete Member
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this member? This action cannot be
              undone.
            </p>
            {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <LoadingButton
                type="button"
                onClick={handleDelete}
                isLoading={isDeleting}
                loadingText="Deleting..."
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </LoadingButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
