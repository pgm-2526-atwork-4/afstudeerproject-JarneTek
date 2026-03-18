"use client";

import { useState, useEffect } from "react";
import DeleteMember from "./DeleteMember";
import EditMember from "./EditMember";
import ManualOrderPopUp from "./ManualOrderPopUp";
import { toggleHasPaid } from "@/lib/actions/members";
import { Member } from "@prisma/client";
import Pagination from "../pagination/pagination";

export default function MembersTable({
  initialMembers,
  clubId,
}: {
  initialMembers: Member[];
  clubId: string;
}) {
  const [groups, setGroups] = useState<string[]>([]);
  const [groupFilter, setGroupFilter] = useState("all");
  const [openPaidMenu, setOpenPaidMenu] = useState<string | null>(null);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const allGroups = initialMembers.map((member) => member.group);
    const uniqueGroups = new Set(allGroups);
    const groups = Array.from(uniqueGroups).sort((a, b) => {
      const uA = a.match(/^[Uu](\d+)/);
      const uB = b.match(/^[Uu](\d+)/);
      if (uA && uB) return parseInt(uA[1]) - parseInt(uB[1]);
      if (uA) return -1;
      if (uB) return 1;
      return a.localeCompare(b);
    });
    setGroups(groups);
    setCurrentPage(1);
  }, [initialMembers, groupFilter]);

  const filteredMembers = initialMembers.filter(
    (member) => groupFilter === "all" || member.group === groupFilter,
  );
  const totalPages = Math.ceil(filteredMembers.length / pageSize);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="space-y-6">
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

      {filteredMembers.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-xl p-10 text-center text-gray-400 text-sm">
          No members found.
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left text-brand-navy [&>th:first-child]:rounded-tl-xl [&>th:last-child]:rounded-tr-xl">
                <th className="px-4 py-3 font-semibold">Member Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">U-Group</th>
                <th className="px-4 py-3 font-semibold">Payment Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMembers.map((member) => (
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
                      onClick={() => setOpenPaidMenu(member.id)}
                      className={`text-xs font-semibold px-3 py-1 rounded-full cursor-pointer transition-colors ${
                        member.hasPaid
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-600 hover:bg-red-200"
                      }`}
                    >
                      {member.hasPaid ? "Paid" : "Unpaid"}
                    </button>
                    {openPaidMenu === member.id && (
                      <div className="absolute top-full left-4 mt-1 z-10 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                        <button
                          onClick={async () => {
                            await toggleHasPaid(member.id);
                            setOpenPaidMenu(null);
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
                      onClick={() =>
                        setOpenActionMenu(
                          openActionMenu === member.id ? null : member.id,
                        )
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-brand-navy font-medium text-xs rounded-lg hover:bg-gray-50 transition-colors ml-auto"
                    >
                      Manage
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform ${openActionMenu === member.id ? "rotate-180" : ""}`}
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>

                    {openActionMenu === member.id && (
                      <div className="absolute top-full right-0 mt-1 z-20 w-44 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 py-1.5 origin-top-right text-left">
                        <EditMember member={member} />

                        <div className="w-full hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="[&_button]:!border-none [&_button]:!bg-transparent [&_button]:!w-full [&_button]:!text-left [&_button]:!px-4 [&_button]:!py-2.5 [&_button]:!rounded-none [&_button>h1]:!font-normal [&_button>h1]:!text-sm [&_button>h1]:!text-gray-700">
                            <ManualOrderPopUp
                              memberId={member.id}
                              clubId={clubId}
                            />
                          </div>
                        </div>

                        <div className="h-px bg-gray-100 my-1 mx-2"></div>

                        <DeleteMember
                          memberId={member.id}
                          onClose={() => setOpenActionMenu(null)}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
