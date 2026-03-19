"use client";
 
import { updateClub } from "@/lib/actions/clubs";
import { useState } from "react";
import { Club } from "@prisma/client";
import { useClub } from "@/providers/clubprovider";
 
export default function ClubInfoForm({ club }: { club: Club }) {
  const { refreshClubs } = useClub();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
 
  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setSuccess(false);
    const result = await updateClub(club.id, formData);
    if (result && "error" in result && result.error) {
      setError(result.error);
      return;
    }
    await refreshClubs();
    setSuccess(true);
  };
 
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Club Settings</h1>
        <p className="text-gray-500 text-sm">Manage your club details</p>
      </div>
 
      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          Club updated successfully!
        </p>
      )}
 
      <form
        action={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl p-6 space-y-4"
      >
        <div className="space-y-1">
          <label className="text-sm font-medium text-brand-navy">
            Club Name
          </label>
          <input
            type="text"
            name="name"
            defaultValue={club.name}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-green"
          />
        </div>
 
        <div className="space-y-1">
          <label className="text-sm font-medium text-brand-navy">
            Primary Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              name="primaryColor"
              defaultValue={club.primaryColor}
              className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
            />
            <input
              type="text"
              defaultValue={club.primaryColor}
              className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400"
              disabled
            />
          </div>
        </div>
 
        <div className="space-y-1">
          <label className="text-sm font-medium text-brand-navy">
            Secondary Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              name="secondaryColor"
              defaultValue={club.secondaryColor || "#ffffff"}
              className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
            />
            <input
              type="text"
              defaultValue={club.secondaryColor || "#ffffff"}
              className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400"
              disabled
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-brand-navy">
            IBAN
          </label>
          <input
            type="text"
            name="iban"
            defaultValue={club.iban || ""}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-green"
          />
        </div>
 
        <button
          type="submit"
          className="bg-brand-navy text-white px-6 py-2 rounded-lg text-sm hover:bg-brand-green transition-colors"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
