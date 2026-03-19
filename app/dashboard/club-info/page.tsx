import { getActiveClubCookie, getSelectedClub } from "@/lib/actions/active-club";
import ClubInfoForm from "@/components/clubs/ClubInfoForm";
 
export default async function ClubInfoPage() {
  const clubId = await getActiveClubCookie();
 
  if (!clubId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        Select a club first.
      </div>
    );
  }
 
  const club = await getSelectedClub(clubId);
 
  if (!club) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        Club not found.
      </div>
    );
  }
 
  return (
    <div className="flex-1 overflow-auto p-6">
      <ClubInfoForm club={club} />
    </div>
  );
}
