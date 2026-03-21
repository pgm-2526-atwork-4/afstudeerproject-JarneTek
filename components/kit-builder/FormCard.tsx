"use client";

import Link from "next/link";
import { Form } from "@prisma/client";
import { updateForm, deleteForm } from "@/lib/actions/forms";
import { useState } from "react";
import LoadingButton from "../ui/LoadingButton";

type FormCardProps = {
  form: Form;
  allGroups: string[];
};

export default function FormCard({ form, allGroups }: FormCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>(
    form.targetGroups,
  );
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCheckbox = (group: string) => {
    if (selectedGroups.includes(group)) {
      setSelectedGroups(selectedGroups.filter((g) => g !== group));
    } else {
      setSelectedGroups([...selectedGroups, group]);
    }
  };

  const handleDeleteForm = async () => {
    setIsDeleting(true);
    const result = await deleteForm(form.id);
    setIsDeleting(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setShowDeleteModal(false);
  };

  const handleUpdateForm = async (formData: FormData) => {
    const result = await updateForm(form.id, formData);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setMenuOpen(false);
  };

  return (
    <>
      <div className="relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-brand-green transition-all duration-200 group">
        <Link href={`/dashboard/form-builder/${form.id}`} className="block">
          <div className="flex items-start justify-between mb-3">
            <div
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                form.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {form.isActive ? "Active" : "Inactive"}
            </div>
          </div>

          <h2 className="text-lg font-bold text-brand-navy group-hover:text-brand-green transition-colors">
            {form.name}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {form.targetGroups.join(", ")}
          </p>
        </Link>

        <button
          onClick={() => setMenuOpen(true)}
          className="mt-3 text-xs text-gray-400 hover:text-brand-navy border border-gray-200 rounded-lg px-3 py-1.5 hover:border-brand-navy transition-colors"
        >
          Edit Form
        </button>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="bg-red-500 text-white ml-2 px-3 py-1.5 rounded-lg text-xs hover:bg-red-600 transition-colors"
        >
          Delete Form
        </button>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-brand-navy">Edit Form</h3>

            <form action={handleUpdateForm} className="space-y-4">
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div>
                <label className="text-sm font-medium text-brand-navy block mb-1">
                  Form Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={form.name}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-green"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-brand-navy mb-2">
                  Target Groups
                </p>
                <div className="flex flex-wrap gap-2">
                  {allGroups.map((group) => (
                    <label
                      key={group}
                      className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <input
                        type="checkbox"
                        name="targetGroups"
                        value={group}
                        checked={selectedGroups.includes(group)}
                        onChange={() => handleCheckbox(group)}
                        className="accent-brand-green"
                      />
                      {group}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <LoadingButton
                  type="submit"
                  loadingText="Updating..."
                  className="bg-brand-navy text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-green transition-colors"
                >
                  Update
                </LoadingButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-brand-navy mb-2">
              Delete Form?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-brand-navy">{form.name}</span>
              ? This action cannot be undone.
            </p>

            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <LoadingButton
                type="button"
                onClick={handleDeleteForm}
                isLoading={isDeleting}
                loadingText="Deleting..."
                className="flex-1 bg-red-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Delete
              </LoadingButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
