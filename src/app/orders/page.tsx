import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSignoutButton from "@/components/admin-signout-button";
import OrdersManagementList from "@/components/orders-management-list";
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
  searchParams: Promise<{ status?: string; from?: string; to?: string }>;
};

function parseStatus(raw?: string): "all" | OrderStatus {
  const allowed = new Set(statusFilters.map((item) => item.value));
  if (!raw || !allowed.has(raw as "all" | OrderStatus)) {
    return "all";
  }
  return raw as "all" | OrderStatus;
}

function parseDateStart(raw?: string): Date | undefined {
  if (!raw) {
    return undefined;
  }
  const parsed = new Date(`${raw}T00:00:00.000Z`);
  return Number.isNaN(parsed.valueOf()) ? undefined : parsed;
}

function parseDateEnd(raw?: string): Date | undefined {
  if (!raw) {
    return undefined;
  }
  const parsed = new Date(`${raw}T23:59:59.999Z`);
  return Number.isNaN(parsed.valueOf()) ? undefined : parsed;
}

function buildFilterHref(status: "all" | OrderStatus, from?: string, to?: string): string {
  const query = new URLSearchParams();
  if (status !== "all") {
    query.set("status", status);
  }
  if (from) {
    query.set("from", from);
  }
  if (to) {
    query.set("to", to);
  }
  const text = query.toString();
  return text.length > 0 ? `/orders?${text}` : "/orders";
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidAdminSessionValue(adminSession)) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const activeStatus = parseStatus(params.status);
  const fromDate = parseDateStart(params.from);
  const toDate = parseDateEnd(params.to);
  const orders = await readOrders({
    status: activeStatus === "all" ? undefined : activeStatus,
    from: fromDate,
    to: toDate,
  });

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
            const href = buildFilterHref(filter.value, params.from, params.to);
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

        <form
          method="get"
          className="flex flex-wrap items-end gap-3 rounded-2xl border border-white/10 bg-zinc-900 p-4"
        >
          <input type="hidden" name="status" value={activeStatus === "all" ? "" : activeStatus} />
          <label className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-300">
            From
            <input
              type="date"
              name="from"
              defaultValue={params.from ?? ""}
              className="mt-1 block rounded-lg border border-zinc-600 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            />
          </label>
          <label className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-300">
            To
            <input
              type="date"
              name="to"
              defaultValue={params.to ?? ""}
              className="mt-1 block rounded-lg border border-zinc-600 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            />
          </label>
          <button
            type="submit"
            className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-amber-950"
          >
            Apply Date Filter
          </button>
          <Link
            href={buildFilterHref(activeStatus, undefined, undefined)}
            className="rounded-lg border border-zinc-600 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-zinc-200"
          >
            Clear Dates
          </Link>
        </form>

        <OrdersManagementList orders={orders} />
      </section>
    </main>
  );
}
