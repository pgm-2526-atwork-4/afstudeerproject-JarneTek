import { getFormsByClubId } from "@/lib/actions/forms";
import { getClubMembers } from "@/lib/actions/members";
import FormCard from "@/components/kit-builder/FormCard";
import NoMembersState from "@/components/dashboard/NoMembersState";
import { getActiveClubCookie, getSelectedClub } from "@/lib/actions/active-club";
import CreateKitForm from "@/components/kit-builder/CreateKitForm";

export default async function FormBuilderPage() {
  const clubid = await getActiveClubCookie();

  if (!clubid) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Please select a club...
      </div>
    );
  }

  const forms = (await getFormsByClubId(clubid)) || [];
  const members = (await getClubMembers(clubid)) || [];
  const selectedClub = await getSelectedClub(clubid);

  const uniqueGroups = [...new Set(members.map((member) => member.group))].sort(
    (a, b) => {
      const aIsU = a.startsWith("U");
      const bIsU = b.startsWith("U");
      if (aIsU && bIsU) return parseInt(a.slice(1)) - parseInt(b.slice(1));
      if (aIsU) return -1;
      if (bIsU) return 1;
      return a.localeCompare(b);
    },
  ); //hier mss ook nog een server action van maken

  if (!members) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <NoMembersState
        clubName={selectedClub?.name}
        onMembersImported={() => getClubMembers(clubid)}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-brand-navy">
                Kit Builder
              </h1>
              <div className="group relative flex items-center">
                <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold cursor-help hover:bg-brand-navy hover:text-white transition-colors">
                  i
                </div>
                <div className="absolute left-full ml-3 w-72 p-3 bg-brand-navy text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 leading-relaxed">
                  A <strong>kit</strong> is a collection of clothing articles
                  (e.g. shirt, shorts, socks) assigned to one or more member
                  groups. Members will order directly from their kit via a
                  personal link.
                  <div className="absolute top-3 -left-1 w-2 h-2 bg-brand-navy transform rotate-45"></div>
                </div>
              </div>
            </div>
            <p className="text-gray-500">
              Create clothing kits for your groups. Each kit contains the
              articles your members can order.
            </p>
          </div>

          {forms.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No kits yet. Create your first one below.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {forms.map((form) => (
                <FormCard
                  key={form.id}
                  form={form}
                  allGroups={uniqueGroups}
                />
              ))}
            </div>
          )}

          <CreateKitForm clubId={clubid} uniqueGroups={uniqueGroups} />
        </div>
      </div>
    </div>
  );
}
