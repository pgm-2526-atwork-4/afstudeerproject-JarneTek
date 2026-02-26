"use client";

import { useState } from "react";
import { createProductForForm } from "@/lib/actions/forms";

const ADULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const KIDS_SIZES = ["104", "116", "128", "140", "152", "164"];

type Props = {
  formId: string;
  onArticleAdded: () => void;
};

export default function AddArticleModal({ formId, onArticleAdded }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(ADULT_SIZES);
  const [articleType, setArticleType] = useState<"BASIC" | "EXTRA">("BASIC");

  const handleAddArticle = async (formData: FormData) => {
    setError(null);
    if (selectedSizes.length === 0) {
      setError("Select at least one size.");
      return;
    }
    formData.set("sizes", selectedSizes.join(","));
    const result = await createProductForForm(formId, formData);
    if (result && "error" in result) {
      setError(result.error);
      return;
    }
    setIsModalOpen(false);
    setError(null);
    setSelectedSizes(ADULT_SIZES);
    setArticleType("BASIC");
    onArticleAdded();
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-brand-navy text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-green transition-colors"
      >
        + Add Article
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-brand-navy">Add Article</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setError(null);
                  setSelectedSizes(ADULT_SIZES);
                }}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <form action={handleAddArticle} className="space-y-3">
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setArticleType("BASIC")}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${articleType === "BASIC" ? "bg-brand-navy text-white" : "text-gray-500 hover:bg-gray-50"}`}
                >
                  Basic
                </button>
                <button
                  type="button"
                  onClick={() => setArticleType("EXTRA")}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${articleType === "EXTRA" ? "bg-brand-navy text-white" : "text-gray-500 hover:bg-gray-50"}`}
                >
                  Extra
                </button>
              </div>

              {articleType === "BASIC" && (
                <input
                  type="number"
                  name="includedInBasicCount"
                  defaultValue={1}
                  min={1}
                  placeholder="Items included in basic package"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-green"
                />
              )}

              <input type="hidden" name="type" value={articleType} />
              <input
                type="text"
                name="name"
                placeholder="Article name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-green"
              />
              <input
                type="text"
                name="description"
                placeholder="Description (optional)"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-green"
              />
              <input
                type="text"
                name="sku"
                placeholder="SKU (optional)"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-green"
              />
              <input
                type="number"
                name="defaultPrice"
                placeholder="Price (e.g. 25.00)"
                step="0.01"
                min="0"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-green"
              />

              <div className="space-y-2">
                <p className="text-sm font-medium text-brand-navy">Sizes</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSizes(ADULT_SIZES)}
                    className="text-xs px-3 py-1 rounded-full border border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white transition-colors"
                  >
                    Volwassenen
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSizes(KIDS_SIZES)}
                    className="text-xs px-3 py-1 rounded-full border border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white transition-colors"
                  >
                    Kinderen
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedSizes([...ADULT_SIZES, ...KIDS_SIZES])
                    }
                    className="text-xs px-3 py-1 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    Alles
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSizes([])}
                    className="text-xs px-3 py-1 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    Wissen
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[...KIDS_SIZES, ...ADULT_SIZES].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        if (selectedSizes.includes(size)) {
                          setSelectedSizes(
                            selectedSizes.filter((s) => s !== size),
                          );
                        } else {
                          setSelectedSizes([...selectedSizes, size]);
                        }
                      }}
                      className={`text-xs px-3 py-1 rounded-full border transition-colors ${selectedSizes.includes(size) ? "bg-brand-navy text-white border-brand-navy" : "border-gray-200 text-gray-500 hover:border-brand-navy"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-brand-navy text-white py-2 rounded-lg text-sm hover:bg-brand-green transition-colors"
                >
                  Add Article
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setError(null);
                    setSelectedSizes(ADULT_SIZES);
                  }}
                  className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
