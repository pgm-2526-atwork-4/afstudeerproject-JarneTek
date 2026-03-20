"use client";

import { useState } from "react";
import { addMember } from "@/lib/actions/members";
import LoadingButton from "@/components/ui/LoadingButton";

type Props = {
  clubId: string;
  existingGroups: string[];
};

export default function AddMemberModal({ clubId, existingGroups }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Controls whether the user is typing a new group vs selecting an existing one
  const [isNewGroup, setIsNewGroup] = useState(existingGroups.length === 0);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    
    // Choose appropriate group field depending on the toggle
    const group = (isNewGroup ? formData.get("newGroup") : formData.get("existingGroup")) as string;

    if (!firstName || !lastName || !email || !group) {
      setError("Please fill in all fields");
      return;
    }

    const result = await addMember(clubId, { firstName, lastName, email, group });

    if (result?.error) {
      setError(typeof result.error === 'string' ? result.error : "Failed to add member");
      return;
    }

    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-brand-navy hover:bg-brand-navy-light text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
      >
        + Add Member
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-brand-navy">Add New Member</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form action={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  <input
                    name="firstName"
                    type="text"
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-brand-green outline-none"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    name="lastName"
                    type="text"
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-brand-green outline-none"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-brand-green outline-none"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium text-gray-700">Group</label>
                  {existingGroups.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsNewGroup(!isNewGroup)}
                      className="text-xs text-brand-green hover:underline font-medium"
                    >
                      {isNewGroup ? "Select existing group" : "Create new group"}
                    </button>
                  )}
                </div>
                
                {isNewGroup ? (
                  <input
                    name="newGroup"
                    type="text"
                    required={isNewGroup}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-brand-green outline-none"
                    placeholder="e.g. U14-Boys"
                  />
                ) : (
                  <select
                    name="existingGroup"
                    required={!isNewGroup}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-brand-green outline-none bg-white"
                  >
                    <option value="">Select a group...</option>
                    {existingGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <LoadingButton
                  type="submit"
                  loadingText="Adding..."
                  className="flex-1 bg-brand-navy hover:bg-brand-navy-light text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Save Member
                </LoadingButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
