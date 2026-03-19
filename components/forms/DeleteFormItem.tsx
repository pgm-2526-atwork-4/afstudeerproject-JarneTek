"use client";

import { deleteFormItem } from "@/lib/actions/forms";
import { useState } from "react";


type Props = {
  formItemId: string;
};

export default function DeleteFormItem({ formItemId }: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

  return (
    <>
    <button
      onClick={async () => {
        setModalOpen(true);
        setError(null);
      }}
      className="text-gray-300 hover:text-red-400 text-lg leading-none transition-colors"
    >
      ×
    </button>
    {modalOpen && (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setModalOpen(false)}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-bold mb-4">Delete Form Item</h2>
                <p className="mb-4">Are you sure you want to delete this form item?</p>
                {error && (
                    <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
                        {error}
                    </p>
                )}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => setModalOpen(false)}
                        className="bg-gray-200 px-4 py-2 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            const result = await deleteFormItem(formItemId);
                            if (result?.error) {
                                setError(result.error);
                                return;
                            }
                            setModalOpen(false);
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
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
