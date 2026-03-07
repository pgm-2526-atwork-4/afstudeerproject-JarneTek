import TestEmailButton from "@/components/mailing/TestEmailButton";

export default function DashboardPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-brand-navy">
              Admin Dashboard
            </h1>
            <p className="text-gray-500">Manage club kit distribution</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-brand-navy mb-4">
              No Active Fitting Day
            </h3>
            <button className="bg-brand-navy text-white px-4 py-2 rounded-lg text-sm">
              Start New Fitting Day
            </button>
            <TestEmailButton />
          </div>
        </div>
      </div>
    </div>
  );
}
