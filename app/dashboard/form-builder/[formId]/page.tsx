"use client";

import { useParams } from "next/navigation";
import { getFormWithItems } from "@/lib/actions/forms";
import { useState, useEffect } from "react";
import { Form, FormItem, Product } from "@prisma/client";
import AddArticleModal from "@/components/forms/AddArticleModal";
import UpdateArticleModal from "@/components/forms/UpdateArticleModal";

type FormWithItems = Form & { items: (FormItem & { product: Product })[] };

export default function FormDetailPage() {
  const params = useParams();
  const formId = params.formId as string;

  const [form, setForm] = useState<FormWithItems | null>(null);

  useEffect(() => {
    getFormWithItems(formId).then(setForm);
  }, [formId]);

  if (!form) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  const basicItems = form.items.filter((item) => item.type === "BASIC");
  const extraItems = form.items.filter((item) => item.type === "EXTRA");

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="w-80 flex-shrink-0 flex flex-col border-r border-gray-200 bg-white overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-brand-navy text-sm">Form Articles</h2>
          <p className="text-xs text-gray-400">Template: {form.targetGroup}</p>
        </div>

        <div className="p-4">
          <AddArticleModal
            formId={formId}
            onArticleAdded={() => getFormWithItems(formId).then(setForm)}
          />
        </div>

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
                    <UpdateArticleModal
                      formItemId={item.id}
                      item={item}
                      onArticleUpdate={() =>
                        getFormWithItems(formId).then(setForm)
                      }
                    />
                    <button className="text-gray-300 hover:text-red-400 text-lg leading-none transition-colors">
                      ×
                    </button>
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

                <div className="border border-dashed border-gray-200 rounded-lg p-3 flex flex-col items-center gap-1 text-gray-400 cursor-pointer hover:border-brand-green transition-colors">
                  <span className="text-lg">↑</span>
                  <span className="text-xs">Upload image</span>
                </div>

                <p className="text-xs text-gray-400">
                  Sizes: {item.product.sizes.join(", ")}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right panel — member preview */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>👁</span>
            <span className="font-medium">Member Preview</span>
          </div>
          <button className="bg-brand-navy text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-green transition-colors">
            Save Form
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {form.items.length === 0 ? (
            <div className="text-center text-gray-400 text-sm mt-20">
              <p className="text-2xl mb-2">📋</p>
              <p>Add articles to see the member preview.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full max-w-xl mx-auto p-6 space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-brand-navy">
                  Select Your Kit
                </h1>
                <p className="text-gray-400 text-sm">
                  Choose your sizes for each item
                </p>
              </div>

              {basicItems.length > 0 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="font-bold text-brand-navy">Basis Pakket</h2>
                    <p className="text-xs text-brand-green">
                      Inbegrepen met lidgeld
                    </p>
                  </div>
                  {basicItems.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-xl overflow-hidden"
                    >
                      <div className="bg-gray-100 h-36 flex items-center justify-center text-gray-300 text-sm">
                        Image Placeholder
                      </div>
                      <div className="p-4 space-y-2">
                        <p className="font-semibold text-brand-navy">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-400">Select Size</p>
                        <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 bg-white">
                          <option>Choose a size...</option>
                          {item.product.sizes.map((size) => (
                            <option key={size}>{size}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {extraItems.length > 0 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="font-bold text-brand-navy">Extra&apos;s</h2>
                    <p className="text-xs text-gray-400">
                      Optioneel — apart te betalen
                    </p>
                  </div>
                  {extraItems.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-xl overflow-hidden"
                    >
                      <div className="bg-gray-100 h-36 flex items-center justify-center text-gray-300 text-sm">
                        Image Placeholder
                      </div>
                      <div className="p-4 space-y-2">
                        <p className="font-semibold text-brand-navy">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-400">Select Size</p>
                        <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 bg-white">
                          <option>Choose a size...</option>
                          {item.product.sizes.map((size) => (
                            <option key={size}>{size}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
