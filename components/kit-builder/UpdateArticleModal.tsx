"use client";

import { useState } from "react";
import { updateFormItem } from "@/lib/actions/forms";
import { uploadImage } from "@/lib/actions/upload";
import LoadingButton from "@/components/ui/LoadingButton";
import type { FormItemWithProduct } from "@/types/forms";

const ADULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const KIDS_SIZES = ["104", "116", "128", "140", "152", "164"];

type Props = {
  formItemId: string;
  item: FormItemWithProduct;
};

export default function UpdateArticleModal({ formItemId, item }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    item.product.sizes,
  );
  const [articleType, setArticleType] = useState(item.type);
  const [imageUrl, setImageUrl] = useState<string>(item.product.imageUrl || "");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [productName, setProductName] = useState(item.product.name);

  const handleUpdateArticle = async (formData: FormData) => {
    setError(null);
    if (selectedSizes.length === 0) {
      setError("Select at least one size.");
      return;
    }

    const imageFile = formData.get("image") as File;
    if (imageFile && imageFile.size > 0) {
      const imageFormData = new FormData();
      imageFormData.set("file", imageFile);
      const url = await uploadImage(imageFormData);
      if (url) {
        formData.set("imageUrl", url);
        setImageUrl(url);
      }
    } else {
      formData.set("imageUrl", imageUrl);
    }

    formData.set("sizes", selectedSizes.join(","));
    const result = await updateFormItem(formItemId, formData);
    if (result && "error" in result) {
      setError(result.error ?? "An unknown error occurred.");
      return;
    }
    setIsModalOpen(false);
    setError(null);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-gray-400 hover:text-brand-navy transition-colors text-sm"
      >
        ✎
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-brand-navy">
                Update Article
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setError(null);
                  setSelectedSizes(ADULT_SIZES);
                  setImagePreview(null);
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

            <form action={handleUpdateArticle} className="space-y-3">
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
                  defaultValue={item.includedInBasicCount}
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
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
              <input
                type="text"
                name="description"
                placeholder="Description (optional)"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-green"
                defaultValue={item.product.description || ""}
              />
              <input
                type="text"
                name="sku"
                placeholder="SKU (optional)"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-green"
                defaultValue={item.product.sku || ""}
              />
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  €
                </span>
                <input
                  type="number"
                  name="defaultPrice"
                  placeholder="Price (e.g. 25.00)"
                  step="0.01"
                  min="0"
                  className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2 text-sm outline-none focus:border-brand-green"
                  defaultValue={item.product.defaultPrice}
                />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-brand-navy">
                  Article Image
                </p>
                <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-brand-navy hover:bg-gray-50 transition-colors group">
                  {imagePreview || imageUrl ? (
                    <img
                      src={imagePreview || imageUrl}
                      alt="Preview"
                      className="h-28 object-contain rounded-lg"
                    />
                  ) : productName ? (
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 bg-brand-green/10 text-brand-green rounded-2xl flex items-center justify-center mb-2 shadow-sm p-3">
                        <span className="text-[11px] font-bold leading-tight uppercase break-words overflow-hidden">
                          {productName}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 group-hover:text-brand-navy transition-colors">
                        Click to replace with photo
                      </span>
                    </div>
                  ) : (
                    <>
                      <svg
                        className="w-8 h-8 text-gray-300 group-hover:text-brand-navy transition-colors mb-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 19.5h18M3.75 4.5h16.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V5.25a.75.75 0 01.75-.75z"
                        />
                      </svg>
                      <span className="text-sm text-gray-400 group-hover:text-brand-navy transition-colors">
                        Click to upload an image
                      </span>
                      <span className="text-xs text-gray-300 mt-0.5">
                        PNG, JPG, WEBP — max 5 MB
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setImagePreview(URL.createObjectURL(file));
                    }}
                  />
                </label>
                {(imagePreview || imageUrl) && (
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setImageUrl("");
                    }}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Remove image
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-brand-navy">Sizes</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSizes(ADULT_SIZES)}
                    className="text-xs px-3 py-1 rounded-full border border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white transition-colors"
                  >
                    Adults
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSizes(KIDS_SIZES)}
                    className="text-xs px-3 py-1 rounded-full border border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white transition-colors"
                  >
                    Kids
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedSizes([...ADULT_SIZES, ...KIDS_SIZES])
                    }
                    className="text-xs px-3 py-1 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSizes([])}
                    className="text-xs px-3 py-1 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    Clear
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
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setError(null);
                    setSelectedSizes(ADULT_SIZES);
                    setImagePreview(null);
                  }}
                  className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <LoadingButton
                  type="submit"
                  loadingText="Adding..."
                  className="flex-1 bg-brand-navy-light hover:bg-brand-navy text-white text-sm font-medium py-2 rounded-lg transition-colors"
                >
                  Save Changes
                </LoadingButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
