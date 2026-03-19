"use client";
import { createForm } from "@/lib/actions/forms";
import { useState, useRef } from "react";
import LoadingButton from "@/components/ui/LoadingButton";

export default function CreateKitForm( { clubId, uniqueGroups}: {clubId: string, uniqueGroups: string[]}) {
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleCreateForm = async (formData: FormData) => {
    const result = await createForm(formData, clubId);
    if (result?.error) {
      setError(result.error);
      return;
    }
    formRef.current?.reset();
  };
  return (
    <form
            action={handleCreateForm}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3"
          >
            <h3 className="font-bold text-brand-navy">New Kit</h3>
            <input
              type="text"
              name="name"
              placeholder="Kit name (e.g. First Team 2024)"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-green"
            />
            <div>
              <p className="text-sm font-medium text-brand-navy mb-2">
                Target Groups
              </p>
              <div className="flex flex-wrap gap-2">
                {uniqueGroups.map((group) => (
                  <label
                    key={group}
                    className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <input
                      type="checkbox"
                      name="targetGroups"
                      value={group}
                      className="accent-brand-green"
                    />
                    {group}
                  </label>
                ))}
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}

            <LoadingButton
              type="submit"
              loadingText="Adding..."
              className="bg-brand-navy text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-green transition-colors"
            >
              + Create Kit
            </LoadingButton>
          </form>
  );
}
