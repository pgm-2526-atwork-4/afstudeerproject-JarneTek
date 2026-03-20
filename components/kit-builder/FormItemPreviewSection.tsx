"use client";

import type { FormItemWithProduct } from "@/types/forms";

type Props = {
  title: string;
  subtitle: string;
  items: FormItemWithProduct[];
};

export default function FormItemPreviewSection({
  title,
  subtitle,
  items,
}: Props) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-4 pt-6 first:pt-0">
      <div>
        <h2 className="font-bold text-brand-navy">{title}</h2>
        <p className="text-xs text-brand-green">{subtitle}</p>
      </div>
      <div className="grid gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm"
          >
            <div className="w-full h-48 bg-gray-50 border-b border-gray-100 flex items-center justify-center p-4">
              {item.product.imageUrl ? (
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform hover:scale-105"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center opacity-60">
                  <div className="w-16 h-16 bg-brand-green/10 text-brand-green rounded-2xl flex items-center justify-center mb-2 shadow-sm p-2">
                    <span className="text-[10px] font-bold leading-tight uppercase break-words overflow-hidden line-clamp-2">
                      {item.product.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">No image</span>
                </div>
              )}
            </div>

            <div className="p-4 space-y-2">
              <p className="font-semibold text-brand-navy">
                {item.product.name}
              </p>
              <p className="text-xs text-gray-400">Select Size</p>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:border-brand-green outline-none transition-colors appearance-none">
                <option value="">Choose a size...</option>
                {item.product.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
