"use client";

import { useEffect, useRef, useState } from "react";
import { Form } from "@prisma/client";
import { useClub } from "@/providers/clubprovider";
import { getFormsByClubId, createForm } from "@/lib/actions/forms";
import FormCard from "@/components/forms/FormCard";

export default function FormBuilderPage() {
  const { selectedClub } = useClub();
  const [forms, setForms] = useState<Form[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!selectedClub) return;
    getFormsByClubId(selectedClub.club.id).then((data) => {
      if (data) setForms(data);
    });
  }, [selectedClub]);

  const handleCreateForm = async (formData: FormData) => {
    if (!selectedClub) return;
    await createForm(formData, selectedClub.club.id);
    formRef.current?.reset();
    const updated = await getFormsByClubId(selectedClub.club.id);
    if (updated) setForms(updated);
  };

  if (!selectedClub) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a club to continue.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-brand-navy">Form Builder</h1>
            <p className="text-gray-500">Manage order forms for your groups</p>
          </div>

          {forms.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No forms yet. Create your first one below.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {forms.map((form) => (
                <FormCard key={form.id} form={form} />
              ))}
            </div>
          )}

          <form
            ref={formRef}
            action={handleCreateForm}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3"
          >
            <h3 className="font-bold text-brand-navy">New Form</h3>
            <input
              type="text"
              name="name"
              placeholder="Form name (e.g. Eerste Ploeg)"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-green"
            />
            <input
              type="text"
              name="targetGroup"
              placeholder="Target group (e.g. Senioren)"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-green"
            />
            <button
              type="submit"
              className="bg-brand-navy text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-green transition-colors"
            >
              + Create Form
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
