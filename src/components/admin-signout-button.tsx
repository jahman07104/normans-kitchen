"use client";

import { useRouter } from "next/navigation";

export default function AdminSignoutButton() {
  const router = useRouter();

  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      className="rounded-full border border-zinc-500 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800"
      type="button"
      onClick={signOut}
    >
      Sign Out
    </button>
  );
}
