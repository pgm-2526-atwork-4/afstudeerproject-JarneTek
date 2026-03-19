import {
  getClubOrders,
  getClubFittingDays,
} from "@/lib/actions/orders";
import { getActiveClubCookie } from "@/lib/actions/active-club";
import OrderDashboard from "@/components/orders/OrderDashboard";

export default async function OrdersPage() {
  const clubId = await getActiveClubCookie();
  if (!clubId) {
    return <div>No club selected</div>;
  }
  const fittingdays = await getClubFittingDays(clubId);
  const orders = await getClubOrders(clubId);

  return <OrderDashboard fittingdays={fittingdays} initialOrders={orders} />;
}
