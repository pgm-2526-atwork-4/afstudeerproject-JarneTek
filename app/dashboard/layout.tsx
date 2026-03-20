import DashboardNav from "@/components/dashboard/dashboardNav";
import ClubProvider from "@/providers/clubprovider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClubProvider>
      <div className="flex flex-col md:flex-row h-screen bg-gray-50">
        <DashboardNav />
        {children}
      </div>
    </ClubProvider>
  );
}
