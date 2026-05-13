"use client";

import { useState } from "react";
import { Bell, CheckCircle, Loader2 } from "lucide-react";

interface BuyerAlertFormProps {
  make?: string;
  model?: string;
}

export function BuyerAlertForm({ make, model }: BuyerAlertFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/buyer-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: name || undefined,
          make,
          model,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setEmail("");
      setName("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <CheckCircle className="mx-auto size-8 text-emerald-600" />
        <p className="mt-3 text-sm font-semibold text-emerald-800">
          Alert created!
        </p>
        <p className="mt-1 text-sm text-emerald-600">
          You will get notified when matching cars are listed.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
        >
          Create another alert
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-stone-200 bg-stone-50 p-6">
      <div className="flex items-center gap-2 text-stone-800">
        <Bell className="size-5 text-amber-500" />
        <h3 className="text-sm font-semibold">Get notified about new listings</h3>
      </div>

      {make && (
        <p className="mt-1 text-xs text-stone-500">
          We will email you when a new {make} {model || ""} is listed.
        </p>
      )}

      <div className="mt-4 space-y-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
          className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
      </div>

      {status === "error" && (
        <p className="mt-2 text-xs text-red-600">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
      >
        {status === "loading" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Bell className="size-4" />
        )}
        {status === "loading" ? "Creating alert..." : "Set Alert"}
      </button>
    </form>
  );
}
