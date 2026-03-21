"use client";

import { updateMember } from "@/lib/actions/members";
import { Member } from "@prisma/client";
import { useState } from "react";
import LoadingButton from "../ui/LoadingButton";

export default function EditMember({ member }: { member: Member }) {
  const [isOpen, setIsOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<
    string,
    string[]
  > | null>(null);

  const handleSubmit = async (formData: FormData) => {
    const result = await updateMember(member.id, {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      group: formData.get("group") as string,
    });
    if (result?.error) {
      setFieldErrors(result.error);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Edit
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-brand-navy mb-4">
              Edit Member
            </h2>

            <form action={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-brand-navy mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  defaultValue={member.firstName}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green"
                />
                {fieldErrors?.firstName && (
                  <p className="text-sm text-red-600">
                    {fieldErrors.firstName[0]}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-brand-navy mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  defaultValue={member.lastName}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green"
                />
                {fieldErrors?.lastName && (
                  <p className="text-sm text-red-600">
                    {fieldErrors.lastName[0]}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-brand-navy mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  defaultValue={member.email}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green"
                />
                {fieldErrors?.email && (
                  <p className="text-sm text-red-600">{fieldErrors.email[0]}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="group"
                  className="block text-sm font-medium text-brand-navy mb-1"
                >
                  Group
                </label>
                <input
                  type="text"
                  name="group"
                  id="group"
                  defaultValue={member.group}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green"
                />
                {fieldErrors?.group && (
                  <p className="text-sm text-red-600">{fieldErrors.group[0]}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <LoadingButton
                  type="submit"
                  loadingText="Saving..."
                  className="flex-1 px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Save
                </LoadingButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
