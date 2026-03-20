"use client";

import MembersCsvUpload from "../csv-import/MembersCsvUpload";

interface NoMembersStateProps {
  clubName?: string;
  onMembersImported?: () => void;
}

export default function NoMembersState({ clubName, onMembersImported }: NoMembersStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="max-w-md bg-white rounded-3xl shadow-2xl shadow-brand-navy/5 border border-gray-100 p-10 flex flex-col items-center">

        <div className="w-20 h-20 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8 rotate-3 hover:rotate-0 transition-transform duration-300">
          <svg
            className="w-10 h-10 text-brand-green"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-brand-navy mb-3">Start with your members</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          You haven&apos;t added any members to{" "}
          <span className="font-semibold text-brand-navy">
            {clubName || "your club"}
          </span>
          . First upload your member list to link kits to the correct
          groups.
        </p>

        <div className="w-full mt-2">
          <MembersCsvUpload onSuccess={onMembersImported} />
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 w-full">
          <p className="text-sm text-gray-500">
            Prefer to add a member manually?
          </p>
          <a
            href="/dashboard/members"
            className="inline-flex items-center mt-2 text-brand-green hover:text-brand-green-dark font-medium transition-colors"
          >
            Go to the members page
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
