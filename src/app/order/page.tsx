"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { menuItems } from "@/lib/menu-data";

type CartMap = Record<string, number>;

const availableItems = menuItems.filter((item) => item.available);

export default function OrderPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartMap>({});
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedItems = useMemo(() => {
    return availableItems
      .filter((item) => (cart[item.id] ?? 0) > 0)
      .map((item) => ({
        ...item,
        quantity: cart[item.id],
        lineTotal: Number((item.price * cart[item.id]).toFixed(2)),
      }));
  }, [cart]);

  const subtotal = useMemo(
    () =>
      Number(
        selectedItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2),
      ),
    [selectedItems],
  );

  function updateQty(itemId: string, nextQty: number) {
    setCart((prev) => {
      const safeQty = Math.max(0, Math.min(20, nextQty));
      const next = { ...prev };
      if (safeQty === 0) {
        delete next[itemId];
      } else {
        next[itemId] = safeQty;
      }
      return next;
    });
  }

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (selectedItems.length === 0) {
      setError("Please add at least one menu item.");
      return;
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      setError("Name and phone are required.");
      return;
    }

    if (orderType === "delivery" && !address.trim()) {
      setError("Delivery address is required.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          orderType,
          address,
          notes,
          items: selectedItems.map((item) => ({
            menuItemId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        order?: {
          id: string;
          subtotal: number;
          customerName: string;
          orderType: "pickup" | "delivery";
        };
      };

      if (!response.ok || !payload.order) {
        setError(payload.error ?? "Unable to place order right now.");
        return;
      }

      const query = new URLSearchParams({
        orderId: payload.order.id,
        total: payload.order.subtotal.toFixed(2),
        name: payload.order.customerName,
        type: payload.order.orderType,
      });
      router.push(`/order/confirmation?${query.toString()}`);
    } catch {
      setError("Network error while placing order.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-amber-50 px-6 py-8 text-zinc-900 md:px-10 lg:px-14">
      <section className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-amber-900/15 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="display text-5xl">Build Your Order</h1>
            <Link
              href="/"
              className="rounded-full border border-zinc-900/20 px-4 py-2 text-sm font-semibold hover:bg-amber-100"
            >
              Back To Home
            </Link>
          </div>
          <p className="mt-2 text-zinc-700">
            Select dishes and submit directly to the kitchen queue.
          </p>

          <ul className="mt-6 space-y-3">
            {availableItems.map((item) => {
              const qty = cart[item.id] ?? 0;
              return (
                <li
                  key={item.id}
                  className="rounded-2xl border border-zinc-900/10 bg-amber-50 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold">{item.name}</p>
                      <p className="text-sm text-zinc-600">
                        {item.description}
                      </p>
                    </div>
                    <p className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      className="h-8 w-8 rounded-full border border-zinc-900/20 font-bold"
                      onClick={() => updateQty(item.id, qty - 1)}
                    >
                      -
                    </button>
                    <p className="w-8 text-center text-lg font-bold">{qty}</p>
                    <button
                      type="button"
                      className="h-8 w-8 rounded-full border border-zinc-900/20 font-bold"
                      onClick={() => updateQty(item.id, qty + 1)}
                    >
                      +
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </article>

        <article className="rounded-3xl border border-zinc-900/10 bg-white p-6">
          <h2 className="text-2xl font-black">Checkout</h2>
          <form className="mt-4 space-y-3" onSubmit={submitOrder}>
            <label className="block text-sm font-semibold">
              Name
              <input
                className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                required
              />
            </label>

            <label className="block text-sm font-semibold">
              Phone
              <input
                className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2"
                value={customerPhone}
                onChange={(event) => setCustomerPhone(event.target.value)}
                required
              />
            </label>

            <label className="block text-sm font-semibold">
              Order Type
              <select
                className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2"
                value={orderType}
                onChange={(event) =>
                  setOrderType(event.target.value as "pickup" | "delivery")
                }
              >
                <option value="pickup">Pickup</option>
                <option value="delivery">Delivery</option>
              </select>
            </label>

            {orderType === "delivery" ? (
              <label className="block text-sm font-semibold">
                Delivery Address
                <input
                  className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  required
                />
              </label>
            ) : null}

            <label className="block text-sm font-semibold">
              Notes (optional)
              <textarea
                className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2"
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </label>

            <div className="rounded-2xl bg-zinc-950 p-4 text-zinc-100">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                Order Summary
              </p>
              <ul className="mt-3 space-y-1 text-sm">
                {selectedItems.length === 0 ? (
                  <li>No items selected yet.</li>
                ) : null}
                {selectedItems.map((item) => (
                  <li key={item.id} className="flex justify-between gap-3">
                    <span>
                      {item.quantity} x {item.name}
                    </span>
                    <span>${item.lineTotal.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex justify-between border-t border-white/15 pt-3 text-lg font-black">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </p>
            </div>

            {error ? (
              <p className="rounded-xl bg-red-100 px-3 py-2 text-sm font-semibold text-red-700">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-emerald-50 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </article>
      </section>
    </main>
  );
}
