"use client";

import { useState } from "react";
import CsvImport from "./csvImport";

export default function MembersCsvUpload({ onSuccess }: { onSuccess?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-200 hover:border-brand-green hover:bg-gray-100 transition-all flex flex-col items-center justify-center gap-2 text-gray-500 group"
      >
        <svg className="w-8 h-8 text-gray-400 group-hover:text-brand-green transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        <span className="font-medium group-hover:text-brand-green transition-colors">Import Members via CSV</span>
      </button>
    );
  }

  return (
    <div className="w-full bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-brand-green/30 transition-all">
      <div className="flex justify-between items-start mb-6 text-left">
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-2">
            Your CSV file must contain the following column headers (exact names):
          </p>
          <div className="bg-white rounded-xl px-4 py-3 mb-4 border border-gray-100 font-mono text-xs text-brand-navy break-all shadow-sm">
            firstName, lastName, email, group, hasPaid
          </div>
          <div className="flex items-start gap-2 p-3 bg-brand-green/5 rounded-lg border border-brand-green/10 text-xs text-gray-600">
            <svg className="w-4 h-4 text-brand-green mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>
              The <strong>hasPaid</strong> column accepts: yes, no, true, false, ja, 1, or 0. 
              You can <a href="data:text/csv;charset=utf-8,firstName,lastName,email,group,hasPaid%0A" download="template.csv" className="text-brand-green font-semibold hover:underline">download an example CSV</a> to start immediately.
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors focus:outline-none"
          title="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <CsvImport onSuccess={onSuccess} />
    </div>
  );
}
