"use client";

import type { FormWithItems } from "@/types/forms";
import UpdateArticleModal from "./UpdateArticleModal";
import DeleteFormItem from "./DeleteFormItem";

export default function FormItemList({
  form,
}: {
  form: FormWithItems;
}) {
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
      {form.items.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-6">
          No articles yet.
        </p>
      ) : (
        form.items.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-xl p-3 space-y-2"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-brand-navy text-sm">
                  {item.product.name}
                </p>
                <p className="text-xs text-gray-400">
                  {item.product.sizes.length} sizes
                </p>
              </div>
              <div className="flex items-center gap-1">
                <UpdateArticleModal formItemId={item.id} item={item} />
                <DeleteFormItem formItemId={item.id} />
              </div>
            </div>

            <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs">
              <div
                className={`flex-1 py-1 text-center font-medium ${item.type === "BASIC" ? "bg-brand-navy text-white" : "text-gray-400"}`}
              >
                Basis Pakket
              </div>
              <div
                className={`flex-1 py-1 text-center font-medium ${item.type === "EXTRA" ? "bg-brand-navy text-white" : "text-gray-400"}`}
              >
                Extra
              </div>
            </div>

            <p className="text-xs text-gray-400">
              Sizes: {item.product.sizes.join(", ")}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
