"use client";

import CsvImport from "./csvImport";

export default function MembersCsvUpload({ onSuccess }: { onSuccess?: () => void }) {
  return (
    <div className="w-full">
      <div className="mb-6 text-left">
        <p className="text-sm text-gray-500 mb-2">
          Je CSV-bestand moet de volgende kolomtitels bevatten (exacte namen):
        </p>
        <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4 border border-gray-100 font-mono text-xs text-brand-navy break-all">
          firstName, lastName, email, group, hasPaid
        </div>
        <div className="flex items-start gap-2 p-3 bg-brand-green/5 rounded-lg border border-brand-green/10 text-xs text-gray-600 mb-6">
          <svg className="w-4 h-4 text-brand-green mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>
            De kolom <strong>hasPaid</strong> accepteert: yes, no, true, false, ja, 1, of 0. 
            Je kan een <a href="data:text/csv;charset=utf-8,firstName,lastName,email,group,hasPaid%0A" download="template.csv" className="text-brand-green font-semibold hover:underline">voorbeeld CSV downloaden</a> om direct te starten.
          </p>
        </div>
      </div>
      
      <CsvImport onSuccess={onSuccess} />
    </div>
  );
}
