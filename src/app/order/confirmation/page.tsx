import Link from "next/link";

type OrderConfirmationPageProps = {
  searchParams: Promise<{
    orderId?: string;
    total?: string;
    name?: string;
    type?: string;
  }>;
};

export default async function OrderConfirmationPage({
  searchParams,
}: OrderConfirmationPageProps) {
  const params = await searchParams;
  const orderId = params.orderId ?? "Pending";
  const total = params.total ?? "0.00";
  const name = params.name ?? "Customer";
  const type = params.type ?? "pickup";

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-10 text-zinc-100">
      <section className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
        <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">
          Order Confirmed
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">
          Respect {name}, your order is in.
        </h1>
        <p className="mt-3 text-zinc-300">
          The kitchen has received your ticket and service updates will follow.
        </p>

        <div className="mt-6 grid gap-3 text-left sm:grid-cols-2">
          <div className="rounded-2xl bg-zinc-900 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">
              Order ID
            </p>
            <p className="mt-2 text-lg font-bold">{orderId}</p>
          </div>
          <div className="rounded-2xl bg-zinc-900 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">
              Subtotal
            </p>
            <p className="mt-2 text-lg font-bold">${total}</p>
          </div>
          <div className="rounded-2xl bg-zinc-900 p-4 sm:col-span-2">
            <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">
              Service Type
            </p>
            <p className="mt-2 text-lg font-bold capitalize">{type}</p>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/order"
            className="rounded-full bg-amber-600 px-5 py-3 text-sm font-bold uppercase tracking-[0.1em] text-amber-50"
          >
            Place Another Order
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-white/20 px-5 py-3 text-sm font-bold uppercase tracking-[0.1em] text-white"
          >
            Open Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
