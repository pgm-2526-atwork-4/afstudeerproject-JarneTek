"use client";
 
import { createClub } from "@/lib/actions/clubs";
import { useState } from "react";
import Link from "next/link";
import LoadingButton from "@/components/ui/LoadingButton";
 
export default function NewClubForm() {
  const [primaryColor, setPrimaryColor] = useState("#1F2937");
  const [secondaryColor, setSecondaryColor] = useState("#6B7280");
  const [error, setError] = useState<string | null>(null);
 
  const handleSubmit = async (formData: FormData) => {
    setError(null);
    const result = await createClub(formData);
    if (result?.error) setError(result.error);
  };
 
  return (
    <form
      action={handleSubmit}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6"
    >
      {error && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      )}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
          Club Details
        </h2>
 
        <div className="grid gap-4">
          <div className="space-y-1">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Club Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              placeholder="e.g. KV Mechelen"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-green focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700"
            >
              Club Logo (Optional)
            </label>
            <input
              type="file"
              name="file"
              id="file"
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-brand-green focus:outline-none bg-white"
            />
          </div>
        </div>
      </div>
 
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
          Branding
        </h2>
 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="primaryColor"
              className="block text-sm font-medium text-gray-700"
            >
              Primary Color
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-10 w-10 p-0 border-0 rounded cursor-pointer overflow-hidden"
              />
              <input
                type="text"
                name="primaryColor"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm uppercase"
              />
            </div>
            <p className="text-xs text-gray-500">
              Used for main buttons and headers
            </p>
          </div>
 
          <div className="space-y-2">
            <label
              htmlFor="secondaryColor"
              className="block text-sm font-medium text-gray-700"
            >
              Secondary Color
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="h-10 w-10 p-0 border-0 rounded cursor-pointer overflow-hidden"
              />
              <input
                type="text"
                name="secondaryColor"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm uppercase"
              />
            </div>
            <p className="text-xs text-gray-500">Used for text and borders</p>
          </div>
        </div>
      </div>
 
      <div className="pt-4 flex justify-end gap-3">
        <Link
          href="/dashboard"
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
        >
          Cancel
        </Link>
        <LoadingButton
          type="submit"
          loadingText="Creating..."
          className="px-6 py-2 bg-brand-green text-white rounded text-sm font-medium hover:opacity-90"
        >
          Create Club
        </LoadingButton>
      </div>
    </form>
  );
}
