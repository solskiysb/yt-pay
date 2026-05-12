"use client";

import { useState, type FormEvent } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface InquiryFormProps {
  listingId: string;
  sellerId: string;
  listingTitle: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export function InquiryForm({
  listingId,
  sellerId,
  listingTitle,
}: InquiryFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const buyerName = (formData.get("name") as string).trim();
    const buyerEmail = (formData.get("email") as string).trim();
    const buyerPhone = (formData.get("phone") as string).trim() || null;
    const message = (formData.get("message") as string).trim();

    if (!buyerName || !buyerEmail || !message) {
      setStatus("error");
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    try {
      const supabase = createClient();

      const { error } = await supabase.from("inquiries").insert({
        listing_id: listingId,
        seller_id: sellerId,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        buyer_phone: buyerPhone,
        message,
        status: "new",
      });

      if (error) {
        throw error;
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      console.error("Inquiry submission error:", err);
      setStatus("error");
      setErrorMessage(
        "Something went wrong. Please try again or contact us directly."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <CheckCircle2 className="mx-auto size-10 text-emerald-600" />
        <h3 className="mt-3 text-lg font-semibold text-stone-900">
          Your inquiry has been sent!
        </h3>
        <p className="mt-2 text-sm text-stone-600">
          The seller will get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 inline-flex h-9 items-center rounded-lg border border-stone-300 px-4 text-sm font-medium text-stone-700 transition hover:border-stone-400"
        >
          Send Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-stone-500">
        Interested in this {listingTitle}? Send the seller a message.
      </p>

      <div>
        <label
          htmlFor="inquiry-name"
          className="block text-sm font-medium text-stone-700"
        >
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="inquiry-name"
          name="name"
          required
          className="mt-1.5 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          placeholder="Your name"
        />
      </div>

      <div>
        <label
          htmlFor="inquiry-email"
          className="block text-sm font-medium text-stone-700"
        >
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="inquiry-email"
          name="email"
          required
          className="mt-1.5 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="inquiry-phone"
          className="block text-sm font-medium text-stone-700"
        >
          Phone{" "}
          <span className="text-xs font-normal text-stone-400">(optional)</span>
        </label>
        <input
          type="tel"
          id="inquiry-phone"
          name="phone"
          className="mt-1.5 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          placeholder="+49 ..."
        />
      </div>

      <div>
        <label
          htmlFor="inquiry-message"
          className="block text-sm font-medium text-stone-700"
        >
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="inquiry-message"
          name="message"
          rows={4}
          required
          className="mt-1.5 block w-full resize-y rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          placeholder="I'm interested in this car. Is it still available?"
        />
      </div>

      {status === "error" && errorMessage && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
          <AlertCircle className="mt-0.5 size-4 flex-shrink-0 text-red-600" />
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-amber-500 text-sm font-semibold text-stone-900 transition-colors hover:bg-amber-400 disabled:opacity-60"
      >
        {status === "submitting" ? (
          "Sending..."
        ) : (
          <>
            <Send className="size-4" />
            Send Inquiry
          </>
        )}
      </button>
    </form>
  );
}
