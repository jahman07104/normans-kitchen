import Link from "next/link";
import { menuItems } from "@/lib/menu-data";

export default function Home() {
  const featuredItems = menuItems.slice(0, 4);

  return (
    <div className="relative isolate overflow-x-clip bg-amber-50 text-zinc-900">
      <div className="absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(circle_at_top,_rgba(199,65,28,0.4),_rgba(251,191,36,0.14)_40%,_transparent_70%)]" />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 py-10 md:px-8 lg:px-12">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-full border border-amber-950/15 bg-white/80 px-5 py-3 backdrop-blur-md">
          <p className="brand-script text-2xl tracking-wide text-amber-900">
            Norman&apos;s Kitchen
          </p>
          <nav className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-700">
            <a
              className="rounded-full px-3 py-1.5 hover:bg-amber-100"
              href="#menu"
            >
              Menu
            </a>
            <a
              className="rounded-full px-3 py-1.5 hover:bg-amber-100"
              href="#why-us"
            >
              Why Us
            </a>
            <Link
              className="rounded-full bg-amber-900 px-4 py-1.5 text-amber-50 transition hover:bg-amber-800"
              href="/dashboard"
            >
              Dashboard
            </Link>
          </nav>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-6">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-amber-900/85">
              Built For Jamaican Cookshops In The Diaspora
            </p>
            <h1 className="display text-5xl leading-[0.92] text-balance text-zinc-900 md:text-7xl">
              Serve iconic yard food faster with a digital storefront that feels
              local.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-zinc-700">
              Launch branded online ordering, real-time kitchen tickets,
              WhatsApp updates, and special menus for busy lunch and Sunday
              dinner service.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                className="rounded-full bg-emerald-700 px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-emerald-50 transition hover:-translate-y-0.5 hover:bg-emerald-600"
                href="#menu"
              >
                Explore Dishes
              </a>
              <Link
                className="rounded-full border border-zinc-900/20 bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-zinc-900 transition hover:-translate-y-0.5 hover:bg-amber-100"
                href="/dashboard"
              >
                Open Operator View
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-amber-900/20 bg-zinc-950 p-6 text-amber-50 shadow-2xl shadow-amber-950/25">
            <p className="text-sm uppercase tracking-[0.18em] text-amber-300">
              Today&apos;s Service Snapshot
            </p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-300">
                  Orders
                </p>
                <p className="mt-2 text-3xl font-black">96</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-300">
                  Avg Ticket
                </p>
                <p className="mt-2 text-3xl font-black">$22.80</p>
              </div>
              <div className="col-span-2 rounded-2xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-300">
                  Hot Seller
                </p>
                <p className="mt-2 text-2xl font-black">
                  Jerk Chicken + Festival
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="menu" className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="display text-4xl text-zinc-900 md:text-5xl">
              Featured Menu
            </h2>
            <p className="max-w-md text-sm uppercase tracking-[0.17em] text-zinc-700">
              Availability can be toggled by shift and sold-out state.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {featuredItems.map((item) => (
              <article
                key={item.id}
                className="group rounded-3xl border border-amber-900/20 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-2xl font-black tracking-tight text-zinc-900">
                    {item.name}
                  </h3>
                  <p className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-900">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <p className="mt-2 text-zinc-700">{item.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em]">
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-zinc-800">
                    {item.category}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">
                    {item.spicyLevel} Spice
                  </span>
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-orange-800">
                    {item.available ? "In Service" : "Sold Out"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="why-us" className="grid gap-4 pb-8 md:grid-cols-3">
          {[
            "Multi-location menus for diaspora operators",
            "WhatsApp-ready order and pickup updates",
            "Kitchen-first workflow built for lunch rush",
          ].map((feature) => (
            <div
              key={feature}
              className="rounded-3xl border border-zinc-900/10 bg-white p-5"
            >
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-600">
                Cookshop Advantage
              </p>
              <p className="mt-3 text-xl font-bold text-zinc-900">{feature}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
