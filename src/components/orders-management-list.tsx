"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import OrderStatusForm from "@/components/order-status-form";
import type { OrderRecord, OrderStatus } from "@/lib/order-store";

const bulkStatuses: Array<{ value: OrderStatus; label: string }> = [
  { value: "new", label: "New" },
  { value: "in_kitchen", label: "In Kitchen" },
  { value: "ready", label: "Ready" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

type Props = {
  orders: OrderRecord[];
};

function formatStatus(status: OrderStatus): string {
  return status.replace("_", " ");
}

export default function OrdersManagementList({ orders }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [bulkStatus, setBulkStatus] = useState<OrderStatus>("in_kitchen");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedIds = useMemo(
    () => Object.keys(selected).filter((id) => selected[id]),
    [selected],
  );

  const allVisibleSelected =
    orders.length > 0 && orders.every((order) => selected[order.id]);

  function toggleOne(orderId: string) {
    setSelected((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  }

  function toggleAll() {
    if (allVisibleSelected) {
      const next = { ...selected };
      for (const order of orders) {
        delete next[order.id];
      }
      setSelected(next);
      return;
    }

    const next = { ...selected };
    for (const order of orders) {
      next[order.id] = true;
    }
    setSelected(next);
  }

  async function applyBulkStatus() {
    setMessage(null);
    setError(null);

    if (selectedIds.length === 0) {
      setError("Select at least one order.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/orders/bulk-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderIds: selectedIds,
          status: bulkStatus,
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        updatedCount?: number;
      };

      if (!response.ok) {
        setError(payload.error ?? "Bulk update failed.");
        return;
      }

      setMessage(`Updated ${payload.updatedCount ?? 0} order(s).`);
      setSelected({});
      router.refresh();
    } catch {
      setError("Network error while applying bulk update.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-zinc-900 p-3">
        <button
          type="button"
          onClick={toggleAll}
          className="rounded-lg border border-zinc-600 px-3 py-2 text-xs font-bold uppercase tracking-[0.1em] text-zinc-100 hover:bg-zinc-800"
        >
          {allVisibleSelected ? "Clear Visible" : "Select Visible"}
        </button>

        <select
          value={bulkStatus}
          onChange={(event) => setBulkStatus(event.target.value as OrderStatus)}
          className="rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2 text-xs font-bold uppercase tracking-[0.1em] text-zinc-100"
        >
          {bulkStatuses.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={applyBulkStatus}
          disabled={submitting}
          className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold uppercase tracking-[0.1em] text-amber-950 disabled:opacity-70"
        >
          {submitting ? "Applying..." : `Apply to ${selectedIds.length}`}
        </button>

        {message ? <p className="text-xs font-semibold text-emerald-300">{message}</p> : null}
        {error ? <p className="text-xs font-semibold text-red-300">{error}</p> : null}
      </div>

      {orders.map((order) => (
        <article key={order.id} className="rounded-2xl border border-white/10 bg-zinc-900 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={Boolean(selected[order.id])}
                onChange={() => toggleOne(order.id)}
                className="h-4 w-4 rounded border-zinc-600 bg-zinc-800"
              />
              <div>
                <p className="text-sm uppercase tracking-[0.12em] text-zinc-400">{order.id.slice(0, 8)}</p>
                <p className="text-lg font-bold">{order.customerName}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-zinc-300">{order.orderType === "pickup" ? "Pickup" : "Delivery"}</p>
              <p className="text-lg font-black text-amber-200">${order.subtotal.toFixed(2)}</p>
            </div>
          </div>

          <ul className="mt-3 space-y-1 text-sm text-zinc-300">
            {order.items.map((item) => (
              <li key={`${order.id}-${item.menuItemId}`} className="flex justify-between gap-3">
                <span>
                  {item.quantity} x {item.name}
                </span>
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
  );
}
