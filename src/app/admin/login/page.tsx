"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError("Login failed. Check your admin email and password.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-10 text-zinc-100">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <p className="text-xs uppercase tracking-[0.18em] text-amber-300">Admin Access</p>
        <h1 className="mt-2 text-3xl font-black">Sign in to Dashboard</h1>
        <p className="mt-2 text-zinc-300">Use your seeded admin email and password to manage orders.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block text-sm font-semibold">
            Admin Email
            <input
              type="email"
              className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="block text-sm font-semibold">
            Admin Password
            <input
              type="password"
              className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error ? <p className="rounded-xl bg-red-950/60 px-3 py-2 text-sm text-red-200">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-amber-600 px-5 py-3 text-sm font-bold uppercase tracking-[0.1em] text-amber-50 disabled:opacity-70"
          >
            {submitting ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </section>
    </main>
  );
}
