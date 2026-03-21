"use client";
import { useState, useEffect } from "react";
import { startFittingDay } from "@/lib/actions/fittingDay";
import { useClub } from "@/providers/clubprovider";
import { Form } from "@prisma/client";
import { getFormsByClubId } from "@/lib/actions/forms";
import LoadingButton from "../ui/LoadingButton";

export default function StartFittingDayModal() {
  const [open, setOpen] = useState(false);
  const { selectedClub } = useClub();
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [errorField, setErrorField] = useState<Record<string, string[]>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadForms() {
      if (!selectedClub) return;
      const fetchedForms = await getFormsByClubId(selectedClub.clubId);
      setForms(fetchedForms || []);
    }
    loadForms();
  }, [selectedClub]);

  const handleStartFittingDay = async (formData: FormData) => {
    setErrorField({});
    setError(null);
    if (!selectedClub) return setError("Club not found");
    if (!selectedForm) return setError("Form not found");
    const result = await startFittingDay(
      selectedClub.clubId,
      selectedForm.id,
      formData,
    );
    if (result.error) {
      if (typeof result.error === "string") {
        setError(result.error);
      } else {
        setErrorField(result.error);
      }
    } else if (result.success) {
      setOpen(false);
      setSelectedForm(null);
    }
  };

  if (!selectedClub) {
    return null;
  }

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="bg-brand-navy text-white px-4 py-2 rounded-lg text-sm"
      >
        Start New Fitting Day
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-brand-navy">
              Start Fitting Day
            </h3>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <form action={handleStartFittingDay} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-navy mb-1">
                  Select Kit / Form
                </label>
                <div className="flex flex-wrap gap-2">
                  {forms.map((form) => (
                    <button
                      key={form.id}
                      type="button"
                      onClick={() => setSelectedForm(form)}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors border ${
                        selectedForm?.id === form.id
                          ? "bg-brand-navy text-white border-brand-navy"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {form.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-brand-navy mb-1"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-green"
                    required
                  />
                  {errorField.date && (
                    <p className="text-red-500 text-sm">{errorField.date[0]}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-brand-navy mb-1"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    placeholder="e.g. Clubhouse"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-green"
                    required
                  />
                  {errorField.location && (
                    <p className="text-red-500 text-sm">
                      {errorField.location[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="startTime"
                    className="block text-sm font-medium text-brand-navy mb-1"
                  >
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    id="startTime"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-green"
                    required
                  />
                  {errorField.startTime && (
                    <p className="text-red-500 text-sm">
                      {errorField.startTime[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="endTime"
                    className="block text-sm font-medium text-brand-navy mb-1"
                  >
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    id="endTime"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-green"
                    required
                  />
                  {errorField.endTime && (
                    <p className="text-red-500 text-sm">
                      {errorField.endTime[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <LoadingButton
                  type="submit"
                  disabled={!selectedForm}
                  loadingText="Starting..."
                  className="bg-brand-navy text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-green transition-colors disabled:opacity-50"
                >
                  Start Fitting Day
                </LoadingButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
