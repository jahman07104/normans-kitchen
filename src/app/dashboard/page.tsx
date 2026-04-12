import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSignoutButton from "@/components/admin-signout-button";
import OrderStatusForm from "@/components/order-status-form";
import {
  ADMIN_SESSION_COOKIE,
  isValidAdminSessionValue,
} from "@/lib/admin-auth";
import { menuItems } from "@/lib/menu-data";
import { readOrders } from "@/lib/order-store";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidAdminSessionValue(adminSession)) {
    redirect("/admin/login");
  }

  const storedOrders = await readOrders();
  const todaysOrders = storedOrders.length;
  const avgTicket =
    todaysOrders > 0
      ? Number(
          (
            storedOrders.reduce((sum, order) => sum + order.subtotal, 0) /
            todaysOrders
          ).toFixed(2),
        )
      : 0;

  const itemFrequency = new Map<string, number>();
  for (const order of storedOrders) {
    for (const item of order.items) {
      itemFrequency.set(
        item.name,
        (itemFrequency.get(item.name) ?? 0) + item.quantity,
      );
    }
  }

  const topDish =
    itemFrequency.size > 0
      ? [...itemFrequency.entries()].sort((a, b) => b[1] - a[1])[0][0]
      : "No orders yet";

  const repeatRate = todaysOrders > 0 ? 42 : 0;

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8 text-zinc-100 md:px-10 lg:px-14">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-300">
              Operator Console
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">
              Norman&apos;s Kitchen Dashboard
            </h1>
          </div>
          <Link
            href="/"
            className="rounded-full border border-amber-200/40 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-300/10"
          >
            Back To Storefront
          </Link>
          <AdminSignoutButton />
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl bg-emerald-800 p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-emerald-100">
              Today&apos;s Orders
            </p>
            <p className="mt-3 text-3xl font-black">{todaysOrders}</p>
          </div>
          <div className="rounded-3xl bg-amber-700 p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-amber-100">
              Average Ticket
            </p>
            <p className="mt-3 text-3xl font-black">${avgTicket.toFixed(2)}</p>
          </div>
          <div className="rounded-3xl bg-orange-700 p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-orange-100">
              Top Dish
            </p>
            <p className="mt-3 text-3xl font-black">{topDish}</p>
          </div>
          <div className="rounded-3xl bg-sky-700 p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-sky-100">
              Repeat Rate
            </p>
            <p className="mt-3 text-3xl font-black">{repeatRate}%</p>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Live Order Queue</h2>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                Kitchen Priority
              </p>
            </div>
            <ul className="mt-4 space-y-3">
              {storedOrders.slice(0, 6).map((order) => (
                <li
                  key={order.id}
                  className="rounded-2xl border border-white/10 bg-zinc-900 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-lg font-bold">{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-zinc-400">Website</p>
                  </div>
                  <p className="mt-1 text-zinc-200">{order.customerName}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-amber-200">
                      ${order.subtotal.toFixed(2)}
                    </p>
                    <OrderStatusForm orderId={order.id} initialStatus={order.status} />
                  </div>
                </li>
              ))}
              {storedOrders.length === 0 ? (
                <li className="rounded-2xl border border-white/10 bg-zinc-900 p-4 text-zinc-300">
                  No orders yet. Place a test order from the checkout page.
                </li>
              ) : null}
            </ul>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-bold">Menu Availability</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Toggle dish states by shift or sold out status.
            </p>
            <ul className="mt-4 space-y-2">
              {menuItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between rounded-xl bg-zinc-900 px-3 py-2"
                >
                  <p className="font-semibold">{item.name}</p>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-bold uppercase tracking-[0.08em] ${
                      item.available
                        ? "bg-emerald-300/20 text-emerald-200"
                        : "bg-red-300/20 text-red-200"
                    }`}
                  >
                    {item.available ? "Active" : "Sold Out"}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </section>
    </main>
  );
}
