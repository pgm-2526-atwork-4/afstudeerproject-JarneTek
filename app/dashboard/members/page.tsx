"use client";

import { useClub } from "@/providers/clubprovider";
import { getClubMembers, toggleHasPaid } from "@/lib/actions/members";
import ManualOrderPopUp from "@/components/members/ManualOrderPopUp";
import CsvImport from "@/components/csv-import/csvImport";
import { useState, useEffect } from "react";
import { Member } from "@prisma/client";
import EditMember from "@/components/members/EditMember";
import DeleteMember from "@/components/members/DeleteMember";

export default function MembersPage() {
  const { selectedClub } = useClub();
  const [members, setMembers] = useState<Member[]>([]);
  const [groupFilter, setGroupFilter] = useState("all");
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  useEffect(() => {
    if (selectedClub) {
      getClubMembers(selectedClub.clubId).then(setMembers);
    }
  }, [selectedClub]);

  useEffect(() => {
    if (groupFilter === "all") {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter((m) => m.group === groupFilter);
      setFilteredMembers(filtered);
    }
  }, [groupFilter, members]);

  if (!selectedClub) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        No club selected.
      </div>
    );
  }

  const allGroups = members.map((m) => m.group);
  const uniqueGroups = new Set(allGroups);
  const groups = Array.from(uniqueGroups).sort((a, b) => {
    const uA = a.match(/^[Uu](\d+)/);
    const uB = b.match(/^[Uu](\d+)/);
    if (uA && uB) return parseInt(uA[1]) - parseInt(uB[1]);
    if (uA) return -1;
    if (uB) return 1;
    return a.localeCompare(b);
  });

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

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <label className="text-sm font-medium text-brand-navy block mb-1">
            U-Group Selection
          </label>
          <select
            name="groupFilter"
            id="groupFilter"
            onChange={(e) => setGroupFilter(e.target.value)}
            className="w-60 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-green"
          >
            <option value="all">All Groups</option>
            {groups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        {members.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-xl p-10 text-center text-gray-400 text-sm">
            No members found.
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-left text-brand-navy">
                  <th className="px-4 py-3 font-semibold">Member Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">U-Group</th>
                  <th className="px-4 py-3 font-semibold">Payment Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-brand-navy">
                      {member.firstName} {member.lastName}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{member.email}</td>
                    <td className="px-4 py-3 text-gray-500">{member.group}</td>
                    <td className="px-4 py-3 relative">
                      <button
                        onClick={() =>
                          setOpenMenu(openMenu === member.id ? null : member.id)
                        }
                        className={`text-xs font-semibold px-3 py-1 rounded-full cursor-pointer transition-colors ${
                          member.hasPaid
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-600 hover:bg-red-200"
                        }`}
                      >
                        {member.hasPaid ? "Paid" : "Unpaid"}
                      </button>
                      {openMenu === member.id && (
                        <div className="absolute top-full left-4 mt-1 z-10 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                          <button
                            onClick={async () => {
                              await toggleHasPaid(member.id);
                              setOpenMenu(null);
                              getClubMembers(selectedClub.clubId).then(
                                setMembers,
                              );
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            {member.hasPaid ? "Mark as Unpaid" : "Mark as Paid"}
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 relative text-right">
                      <button
                        onClick={() => setOpenActionMenu(openActionMenu === member.id ? null : member.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-brand-navy font-medium text-xs rounded-lg hover:bg-gray-50 transition-colors ml-auto"
                      >
                        Manage
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${openActionMenu === member.id ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
                      </button>

                      {openActionMenu === member.id && (
                        <div className="absolute top-full right-4 mt-2 z-20 w-44 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 py-1.5 overflow-hidden origin-top-right text-left">
                          <EditMember
                            member={member}
                            onSuccess={() => getClubMembers(selectedClub.clubId).then(setMembers)}
                          />
                          
                          <div className="w-full hover:bg-gray-50 transition-colors cursor-pointer">
                            <div className="[&_button]:!border-none [&_button]:!bg-transparent [&_button]:!w-full [&_button]:!text-left [&_button]:!px-4 [&_button]:!py-2.5 [&_button]:!rounded-none [&_button>h1]:!font-normal [&_button>h1]:!text-sm [&_button>h1]:!text-gray-700">
                              <ManualOrderPopUp memberId={member.id} clubId={selectedClub.clubId} />
                            </div>
                          </div>

                          <div className="h-px bg-gray-100 my-1 mx-2"></div>

                          <DeleteMember 
                            memberId={member.id} 
                            onClose={() => setOpenActionMenu(null)} 
                            onSuccess={() => getClubMembers(selectedClub.clubId).then(setMembers)}
                          />
                        </div>
                      )}
                    </td>
                  </tr>

                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
