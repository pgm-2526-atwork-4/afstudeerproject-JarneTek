

import { getDashboardStats } from "@/lib/actions/dashboard";
import Link from "next/link";
import StartFittingDayModal from "@/components/dashboard/startFittingDayModal";
import { getActiveClubCookie, getSelectedClub } from "@/lib/actions/active-club";


const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  ORDERED: "bg-purple-100 text-purple-700",
  RECEIVED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
};

export default async function DashboardPage() {
  const selectedClub = await getActiveClubCookie();
  if (!selectedClub) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        No club selected.
      </div>
    );
  }
  const stats = await getDashboardStats(selectedClub);
  const club = await getSelectedClub(selectedClub);




  if (!stats) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        Could not load dashboard data.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-brand-navy">
              Welcome back
            </h1>
            <p className="text-gray-500 text-sm">
              {club?.name} -- {stats.totalMembers} members
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-sm text-gray-400">Members</p>
              <p className="text-2xl font-bold text-brand-navy mt-1">{stats.totalMembers}</p>
              <p className="text-xs text-gray-400 mt-1">
                {stats.unpaidMembers > 0
                  ? `${stats.unpaidMembers} haven't paid yet`
                  : "Everyone has paid"}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-sm text-gray-400">Orders</p>
              <p className="text-2xl font-bold text-brand-navy mt-1">{stats.recentOrders.length}</p>
              <p className="text-xs text-gray-400 mt-1">
                {stats.pendingOrders > 0
                  ? `${stats.pendingOrders} pending`
                  : "All up to date"}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-sm text-gray-400">Revenue</p>
              <p className="text-2xl font-bold text-brand-navy mt-1">EUR {stats.totalRevenue.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">
                {stats.activeForms} active kit form{stats.activeForms !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-brand-navy mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <QuickActionLink href="/dashboard/members" label="Manage Members" />
                <QuickActionLink href="/dashboard/form-builder" label="Kit Builder" />
                <QuickActionLink href="/dashboard/order-overview" label="View Orders" />
                <QuickActionLink href="/dashboard/club-info" label="Club Settings" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-brand-navy mb-4">Fitting Day</h2>
              {stats.fittingDay ? (
                <div className={`${stats.fittingDay.isUpcoming ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"} border rounded-lg p-4 mb-4`}>
                  <p className={`text-sm font-medium ${stats.fittingDay.isUpcoming ? "text-green-800" : "text-gray-600"}`}>
                    {stats.fittingDay.isUpcoming ? "Upcoming" : "Last fitting day"}
                  </p>
                  <p className={`text-sm mt-1 ${stats.fittingDay.isUpcoming ? "text-green-700" : "text-gray-500"}`}>
                    {new Date(stats.fittingDay.date).toLocaleDateString("nl-BE", {
                      weekday: "long", day: "numeric", month: "long",
                    })}
                  </p>
                  <p className={`text-sm ${stats.fittingDay.isUpcoming ? "text-green-600" : "text-gray-400"}`}>
                    {stats.fittingDay.startTime} - {stats.fittingDay.endTime}
                    {stats.fittingDay.location && ` -- ${stats.fittingDay.location}`}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-400 mb-4">No fitting days yet.</p>
              )}
              <StartFittingDayModal />
            </div>
          </div>

          {stats.recentOrders.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-brand-navy">Recent Orders</h2>
                <Link
                  href="/dashboard/order-overview"
                  className="text-sm text-brand-green hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {stats.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-brand-navy">{order.memberName}</p>
                      <p className="text-xs text-gray-400">
                        {order.group} -- {order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">EUR {order.totalPrice.toFixed(2)}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status]}`}>
                        {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickActionLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-brand-green hover:bg-green-50/30 transition-colors group"
    >
      <span className="text-sm font-medium text-brand-navy group-hover:text-brand-green transition-colors">
        {label}
      </span>
      <span className="text-gray-300 group-hover:text-brand-green transition-colors">&#8594;</span>
    </Link>
  );
}
