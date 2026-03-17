
import { getClubMembers } from "@/lib/actions/members";
import CsvImport from "@/components/csv-import/csvImport";
import MembersTable from "@/components/members/MembersTable";
import { getActiveClubCookie } from "@/lib/actions/active-club";


export default async function MembersPage() {
  const clubId = await getActiveClubCookie();
  const members = await getClubMembers(clubId!);

  if (!clubId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        No club selected.
      </div>
    );
  }

 

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Members</h1>
          <p className="text-gray-500 text-sm">{members.length} members</p>
        </div>

        <details className="bg-white border border-gray-200 rounded-xl p-6">
          <summary className="text-lg font-semibold text-brand-navy cursor-pointer">
            Import Members via CSV
          </summary>
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-1">
              Your CSV file must include the following column headers (exact
              names):
            </p>
            <p className="text-sm font-mono bg-gray-50 rounded-lg px-3 py-2 mb-3 text-brand-navy">
              firstName, lastName, email, group, hasPaid
            </p>
            <p className="text-xs text-gray-400 mb-4">
              The <strong>hasPaid</strong> column accepts: yes, no, true, false, ja, 1, or 0. You can{" "}
              <a
                href="data:text/csv;charset=utf-8,firstName,lastName,email,group,hasPaid%0A"
                download="template.csv"
                className="text-brand-green font-semibold hover:underline"
              >
                download a template CSV
              </a>{" "}
              to get started.
            </p>
            <CsvImport />
          </div>
        </details>

        <MembersTable initialMembers={members} clubId={clubId} />
      </div>
    </div>
  );
}
