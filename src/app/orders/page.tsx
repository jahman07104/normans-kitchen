import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSignoutButton from "@/components/admin-signout-button";
import OrderStatusForm from "@/components/order-status-form";
import {
  ADMIN_SESSION_COOKIE,
  isValidAdminSessionValue,
} from "@/lib/admin-auth";
import { readOrders, type OrderStatus } from "@/lib/order-store";

export const dynamic = "force-dynamic";

const statusFilters: Array<{ value: "all" | OrderStatus; label: string }> = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "in_kitchen", label: "In Kitchen" },
  { value: "ready", label: "Ready" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

type OrdersPageProps = {
  searchParams: Promise<{ status?: string }>;
};

function parseStatus(raw?: string): "all" | OrderStatus {
  const allowed = new Set(statusFilters.map((item) => item.value));
  if (!raw || !allowed.has(raw as "all" | OrderStatus)) {
    return "all";
  }
  return raw as "all" | OrderStatus;
}

function formatStatus(status: OrderStatus): string {
  return status.replace("_", " ");
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidAdminSessionValue(adminSession)) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const activeStatus = parseStatus(params.status);
  const orders =
    activeStatus === "all"
      ? await readOrders()
      : await readOrders({ status: activeStatus });

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8 text-zinc-100 md:px-10 lg:px-14">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-white/5 p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Order Management</p>
            <h1 className="mt-1 text-3xl font-black">All Orders</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/dashboard"
              className="rounded-full border border-zinc-500 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800"
            >
              Dashboard
            </Link>
            <Link
              href="/"
              className="rounded-full border border-amber-200/40 px-4 py-2 text-sm font-semibold text-amber-100 hover:bg-amber-300/10"
            >
              Storefront
            </Link>
            <AdminSignoutButton />
          </div>
        </header>

        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => {
            const active = filter.value === activeStatus;
            const href = filter.value === "all" ? "/orders" : `/orders?status=${filter.value}`;
            return (
              <Link
                key={filter.value}
                href={href}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] ${
                  active
                    ? "bg-amber-500 text-amber-950"
                    : "border border-zinc-600 text-zinc-200 hover:bg-zinc-800"
                }`}
              >
                {filter.label}
              </Link>
            );
          })}
        </div>

        <section className="space-y-3">
          {orders.map((order) => (
            <article key={order.id} className="rounded-2xl border border-white/10 bg-zinc-900 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm uppercase tracking-[0.12em] text-zinc-400">{order.id.slice(0, 8)}</p>
                  <p className="text-lg font-bold">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-zinc-300">{order.orderType === "pickup" ? "Pickup" : "Delivery"}</p>
                  <p className="text-lg font-black text-amber-200">${order.subtotal.toFixed(2)}</p>
                </div>
              </div>

              <ul className="mt-3 space-y-1 text-sm text-zinc-300">
                {order.items.map((item) => (
                  <li key={`${order.id}-${item.menuItemId}`} className="flex justify-between gap-3">
                    <span>{item.quantity} x {item.name}</span>
                    <span>${item.lineTotal.toFixed(2)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.12em] text-zinc-400">
                  Created {new Date(order.createdAt).toLocaleString()}
                </p>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-zinc-200">
                    {formatStatus(order.status)}
                  </span>
                  <OrderStatusForm orderId={order.id} initialStatus={order.status} />
                </div>
              </div>
            </article>
          ))}

          {orders.length === 0 ? (
            <article className="rounded-2xl border border-white/10 bg-zinc-900 p-6 text-zinc-300">
              No orders for this filter yet.
            </article>
          ) : null}
        </section>
      </section>
    </main>
  );
}
