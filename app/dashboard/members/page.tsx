
import { getClubMembers, getClubGroups } from "@/lib/actions/members";
import MembersCsvUpload from "@/components/csv-import/MembersCsvUpload";
import MembersTable from "@/components/members/MembersTable";
import AddMemberModal from "@/components/members/AddMemberModal";
import { getActiveClubCookie } from "@/lib/actions/active-club";


export default async function MembersPage() {
  const clubId = await getActiveClubCookie();
  
  if (!clubId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        No club selected.
      </div>
    );
  }

  const members = await getClubMembers(clubId);
  const existingGroups = await getClubGroups(clubId);

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-brand-navy">Members</h1>
            <p className="text-gray-500 text-sm">{members.length} members</p>
          </div>
          <AddMemberModal clubId={clubId} existingGroups={existingGroups} />
        </div>

        <div className="w-full">
          <MembersCsvUpload />
        </div>

        <MembersTable initialMembers={members} clubId={clubId} />
      </div>
    </div>
  );
}
