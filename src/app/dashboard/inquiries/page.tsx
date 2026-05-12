"use client";

import { useState } from "react";
import {
  MessageSquare,
  Mail,
  Clock,
  ChevronDown,
  ChevronUp,
  Check,
  Archive,
  Car,
  Send,
  Reply,
  Loader2,
} from "lucide-react";

type InquiryStatus = "new" | "read" | "replied" | "archived";

interface Inquiry {
  id: string;
  buyerName: string;
  buyerEmail: string;
  listingTitle: string;
  listingId: string;
  message: string;
  date: string;
  status: InquiryStatus;
  sellerReply?: string;
  repliedAt?: string;
}

const mockInquiries: Inquiry[] = [
  {
    id: "inq-1",
    buyerName: "Thomas Mueller",
    buyerEmail: "thomas.mueller@gmail.com",
    listingTitle: "1973 Porsche 911 Carrera RS 2.7",
    listingId: "porsche-911-carrera-rs-1973",
    message:
      "Hello, I am very interested in this Carrera RS. I have been searching for a matching-numbers example for several years now. Is the car still available? I would love to arrange a viewing at your facility in Stuttgart. I am based in Munich and can travel on short notice. Could you also provide the full documentation and any recent inspection reports? Thank you.",
    date: "2026-05-12T10:30:00",
    status: "new",
  },
  {
    id: "inq-2",
    buyerName: "Sophie Laurent",
    buyerEmail: "sophie.laurent@outlook.fr",
    listingTitle: "1987 Porsche 911 Turbo (930)",
    listingId: "porsche-911-turbo-1987",
    message:
      "Bonjour, can you provide more details about the service history of this 930 Turbo? Specifically, I would like to know when the turbo was last rebuilt and if there are any known issues with the car. I am a collector based in Lyon and have purchased several 930s before. Thank you for your time.",
    date: "2026-05-12T07:15:00",
    status: "new",
  },
  {
    id: "inq-3",
    buyerName: "Marco Rossi",
    buyerEmail: "m.rossi@email.it",
    listingTitle: "1967 Mercedes-Benz 280 SL Pagoda",
    listingId: "mercedes-280sl-1967",
    message:
      "Very interested in your Pagoda. What is your best price for a quick and straightforward sale? I can arrange bank transfer immediately. Also, is the hardtop included?",
    date: "2026-05-11T15:45:00",
    status: "read",
  },
  {
    id: "inq-4",
    buyerName: "Anna Bergstrom",
    buyerEmail: "anna.bergstrom@telia.se",
    listingTitle: "1994 Porsche 911 Carrera (993)",
    listingId: "porsche-911-993-1994",
    message:
      "Hi, would you consider shipping to Sweden? I have a trusted transport company that handles classic cars across Europe. Also, has the car been in any accidents or had any bodywork done?",
    date: "2026-05-10T09:20:00",
    status: "read",
  },
  {
    id: "inq-5",
    buyerName: "Pierre Dupont",
    buyerEmail: "p.dupont@wanadoo.fr",
    listingTitle: "1973 Porsche 911 Carrera RS 2.7",
    listingId: "porsche-911-carrera-rs-1973",
    message:
      "Does the Certificate of Authenticity confirm matching numbers for the engine and gearbox? I would also appreciate knowing the car's paint thickness readings if available. I am a serious buyer with financing already arranged.",
    date: "2026-05-09T14:00:00",
    status: "replied",
    sellerReply:
      "Yes, matching numbers confirmed. Happy to share the full documentation. Please contact us to arrange a viewing.",
    repliedAt: "2026-05-09T16:00:00",
  },
  {
    id: "inq-6",
    buyerName: "Hans Weber",
    buyerEmail: "h.weber@gmx.de",
    listingTitle: "1987 Porsche 911 Turbo (930)",
    listingId: "porsche-911-turbo-1987",
    message:
      "I am interested but would like to have an independent inspection done before proceeding. Would you be open to this? I can arrange an inspector in Zurich.",
    date: "2026-05-07T11:30:00",
    status: "archived",
  },
];

const statusConfig: Record<
  InquiryStatus,
  { label: string; className: string }
> = {
  new: { label: "New", className: "bg-amber-100 text-amber-700" },
  read: { label: "Read", className: "bg-stone-100 text-stone-600" },
  replied: { label: "Replied", className: "bg-emerald-100 text-emerald-700" },
  archived: { label: "Archived", className: "bg-stone-50 text-stone-400" },
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState(mockInquiries);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    if (expandedId !== id) {
      // Close reply form when switching inquiries
      setReplyingId(null);
      setReplyText("");
    }
  };

  const markAsRead = (id: string) => {
    setInquiries((prev) =>
      prev.map((inq) =>
        inq.id === id ? { ...inq, status: "read" as const } : inq
      )
    );
  };

  const archiveInquiry = (id: string) => {
    setInquiries((prev) =>
      prev.map((inq) =>
        inq.id === id ? { ...inq, status: "archived" as const } : inq
      )
    );
  };

  const handleReply = async (inquiryId: string) => {
    if (!replyText.trim()) return;

    setSendingReply(true);
    try {
      const res = await fetch("/api/inquiries/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId,
          message: replyText.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send reply");
      }

      // Update local state
      setInquiries((prev) =>
        prev.map((inq) =>
          inq.id === inquiryId
            ? {
                ...inq,
                status: "replied" as const,
                sellerReply: replyText.trim(),
                repliedAt: new Date().toISOString(),
              }
            : inq
        )
      );
      setReplyingId(null);
      setReplyText("");
    } catch (err) {
      console.error("Reply error:", err);
      alert("Failed to send reply. Please try again.");
    } finally {
      setSendingReply(false);
    }
  };

  const unreadCount = inquiries.filter((i) => i.status === "new").length;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-2xl font-bold text-stone-900">
            Inquiries
          </h2>
          {unreadCount > 0 && (
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-amber-500 px-2 text-xs font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-stone-500">
          Messages from potential buyers
        </p>
      </div>

      {/* Inquiry list */}
      <div className="space-y-3">
        {inquiries.map((inquiry) => {
          const isExpanded = expandedId === inquiry.id;
          const isReplying = replyingId === inquiry.id;
          const status = statusConfig[inquiry.status];

          return (
            <div
              key={inquiry.id}
              className={`overflow-hidden rounded-xl bg-white ring-1 ring-stone-200 transition-shadow ${
                inquiry.status === "new" ? "ring-amber-200" : ""
              }`}
            >
              {/* Summary row */}
              <button
                onClick={() => toggleExpand(inquiry.id)}
                className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-stone-50"
              >
                <div
                  className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                    inquiry.status === "new"
                      ? "bg-amber-500"
                      : "bg-transparent"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-semibold text-stone-900">
                      {inquiry.buyerName}
                    </p>
                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={`hidden items-center rounded-full px-2 py-0.5 text-xs font-medium sm:inline-flex ${status.className}`}
                      >
                        {status.label}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-stone-400">
                        <Clock className="size-3" />
                        {formatDate(inquiry.date)}
                      </span>
                    </div>
                  </div>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-amber-600">
                    <Car className="size-3" />
                    {inquiry.listingTitle}
                  </p>
                  {!isExpanded && (
                    <p className="mt-1 truncate text-sm text-stone-500">
                      {inquiry.message}
                    </p>
                  )}
                </div>
                <div className="shrink-0 pt-1 text-stone-400">
                  {isExpanded ? (
                    <ChevronUp className="size-4" />
                  ) : (
                    <ChevronDown className="size-4" />
                  )}
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-stone-100 px-4 pb-4">
                  <div className="ml-5 mt-3 space-y-4">
                    {/* Contact */}
                    <div className="flex items-center gap-2 text-sm text-stone-500">
                      <Mail className="size-3.5" />
                      <a
                        href={`mailto:${inquiry.buyerEmail}`}
                        className="text-amber-600 hover:underline"
                      >
                        {inquiry.buyerEmail}
                      </a>
                    </div>

                    {/* Full message */}
                    <p className="text-sm leading-relaxed text-stone-700">
                      {inquiry.message}
                    </p>

                    {/* Previous reply */}
                    {inquiry.sellerReply && (
                      <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                        <p className="mb-1 text-xs font-medium text-emerald-700">
                          Your reply
                          {inquiry.repliedAt && (
                            <span className="ml-1 font-normal text-emerald-600">
                              &middot; {formatDate(inquiry.repliedAt)}
                            </span>
                          )}
                        </p>
                        <p className="text-sm leading-relaxed text-stone-700">
                          {inquiry.sellerReply}
                        </p>
                      </div>
                    )}

                    {/* Reply form */}
                    {isReplying && (
                      <div className="space-y-3">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={4}
                          placeholder="Write your reply..."
                          className="block w-full resize-y rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReply(inquiry.id)}
                            disabled={sendingReply || !replyText.trim()}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-medium text-stone-900 transition-colors hover:bg-amber-400 disabled:opacity-60"
                          >
                            {sendingReply ? (
                              <>
                                <Loader2 className="size-3 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="size-3" />
                                Send Reply
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setReplyingId(null);
                              setReplyText("");
                            }}
                            disabled={sendingReply}
                            className="inline-flex items-center rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      {inquiry.status === "new" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(inquiry.id);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-200"
                        >
                          <Check className="size-3" />
                          Mark as Read
                        </button>
                      )}
                      {inquiry.status !== "archived" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            archiveInquiry(inquiry.id);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-200"
                        >
                          <Archive className="size-3" />
                          Archive
                        </button>
                      )}
                      {inquiry.status !== "archived" && !isReplying && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setReplyingId(inquiry.id);
                            setReplyText("");
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-stone-900 transition-colors hover:bg-amber-400"
                        >
                          <Reply className="size-3" />
                          Reply
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
