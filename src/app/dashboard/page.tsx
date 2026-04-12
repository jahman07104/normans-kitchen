import Link from "next/link";
import { dashboardKpis, menuItems } from "@/lib/menu-data";

const orderQueue = [
  {
    id: "#1041",
    customer: "M. Thompson",
    channel: "Website",
    total: 28.5,
    status: "In Kitchen",
  },
  {
    id: "#1040",
    customer: "A. Williams",
    channel: "WhatsApp",
    total: 19,
    status: "Ready For Pickup",
  },
  {
    id: "#1039",
    customer: "S. Bailey",
    channel: "Phone",
    total: 41,
    status: "Out For Delivery",
  },
];

export default function DashboardPage() {
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
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl bg-emerald-800 p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-emerald-100">
              Today&apos;s Orders
            </p>
            <p className="mt-3 text-3xl font-black">
              {dashboardKpis.todaysOrders}
            </p>
          </div>
          <div className="rounded-3xl bg-amber-700 p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-amber-100">
              Average Ticket
            </p>
            <p className="mt-3 text-3xl font-black">
              ${dashboardKpis.avgTicket.toFixed(2)}
            </p>
          </div>
          <div className="rounded-3xl bg-orange-700 p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-orange-100">
              Top Dish
            </p>
            <p className="mt-3 text-3xl font-black">{dashboardKpis.topDish}</p>
          </div>
          <div className="rounded-3xl bg-sky-700 p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-sky-100">
              Repeat Rate
            </p>
            <p className="mt-3 text-3xl font-black">
              {dashboardKpis.repeatRate}%
            </p>
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
              {orderQueue.map((order) => (
                <li
                  key={order.id}
                  className="rounded-2xl border border-white/10 bg-zinc-900 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-lg font-bold">{order.id}</p>
                    <p className="text-sm text-zinc-400">{order.channel}</p>
                  </div>
                  <p className="mt-1 text-zinc-200">{order.customer}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-amber-200">
                      ${order.total.toFixed(2)}
                    </p>
                    <p className="rounded-full bg-amber-300/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-amber-200">
                      {order.status}
                    </p>
                  </div>
                </li>
              ))}
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
