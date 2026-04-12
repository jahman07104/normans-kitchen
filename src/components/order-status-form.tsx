"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OrderStatus } from "@/lib/order-store";

const options: Array<{ value: OrderStatus; label: string }> = [
  { value: "new", label: "New" },
  { value: "in_kitchen", label: "In Kitchen" },
  { value: "ready", label: "Ready" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

type Props = {
  orderId: string;
  initialStatus: OrderStatus;
};

export default function OrderStatusForm({ orderId, initialStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        setError(response.status === 401 ? "Unauthorized" : "Failed");
        return;
      }

      router.refresh();
    } catch {
      setError("Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        className="rounded-lg border border-zinc-600 bg-zinc-900 px-2 py-1 text-xs font-semibold uppercase tracking-[0.08em]"
        value={status}
        onChange={(event) => setStatus(event.target.value as OrderStatus)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={save}
        disabled={loading}
        className="rounded-lg bg-amber-400/20 px-2 py-1 text-xs font-bold uppercase tracking-[0.08em] text-amber-100 disabled:opacity-70"
      >
        {loading ? "..." : "Save"}
      </button>
      {error ? <span className="text-xs text-red-300">{error}</span> : null}
    </div>
  );
}
