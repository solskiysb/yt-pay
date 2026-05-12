"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle, XCircle, Eye, Filter } from "lucide-react";

type ModerationStatus = "pending_review" | "approved" | "rejected";

interface ModerationItem {
  id: string;
  title: string;
  image: string;
  seller: string;
  sellerEmail: string;
  price: number;
  submittedAt: string;
  status: ModerationStatus;
  rejectReason?: string;
}

const moderationItems: ModerationItem[] = [
  {
    id: "mod-001",
    title: "1973 Porsche 911 Carrera RS 2.7",
    image:
      "https://images.unsplash.com/photo-1671981151707-7aa791793275?w=200&q=60",
    seller: "Klassik Automobil Stuttgart",
    sellerEmail: "info@klassik-stuttgart.de",
    price: 178000,
    submittedAt: "2026-05-11",
    status: "pending_review",
  },
  {
    id: "mod-002",
    title: "1987 Porsche 911 Turbo (930)",
    image:
      "https://images.unsplash.com/photo-1759773826076-0d1ec3a3049e?w=200&q=60",
    seller: "Prestige Motors AG",
    sellerEmail: "sales@prestige-motors.ch",
    price: 125000,
    submittedAt: "2026-05-11",
    status: "pending_review",
  },
  {
    id: "mod-003",
    title: "1967 Alfa Romeo Spider 1600 Duetto",
    image:
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200&q=60",
    seller: "Rosso Corsa Classics",
    sellerEmail: "vendite@rossocorsa.it",
    price: 68000,
    submittedAt: "2026-05-10",
    status: "pending_review",
  },
  {
    id: "mod-004",
    title: "1961 Jaguar E-Type Series 1 Roadster",
    image:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=200&q=60",
    seller: "British Heritage Motors",
    sellerEmail: "sales@bhm.co.uk",
    price: 245000,
    submittedAt: "2026-05-10",
    status: "pending_review",
  },
  {
    id: "mod-005",
    title: "2019 BMW M3 Competition",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&q=60",
    seller: "Quick Flip Motors",
    sellerEmail: "qf@motors.com",
    price: 52000,
    submittedAt: "2026-05-09",
    status: "rejected",
    rejectReason: "Not a classic or retro vehicle. Must be 25+ years old.",
  },
  {
    id: "mod-006",
    title: "1989 Mercedes-Benz 300 SL",
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=200&q=60",
    seller: "Hamburg Classics GmbH",
    sellerEmail: "info@hbg-classics.de",
    price: 89500,
    submittedAt: "2026-05-09",
    status: "approved",
  },
  {
    id: "mod-007",
    title: "1955 Mercedes-Benz 300 SL Gullwing",
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=200&q=60",
    seller: "Concours Collection",
    sellerEmail: "contact@concours.de",
    price: 1350000,
    submittedAt: "2026-05-08",
    status: "approved",
  },
  {
    id: "mod-008",
    title: "1970 Datsun 240Z",
    image:
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200&q=60",
    seller: "JDM Legends EU",
    sellerEmail: "info@jdm-legends.eu",
    price: 48000,
    submittedAt: "2026-05-08",
    status: "pending_review",
  },
  {
    id: "mod-009",
    title: "1985 Toyota AE86 Sprinter Trueno",
    image:
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200&q=60",
    seller: "Drift Heritage",
    sellerEmail: "shop@drifth.eu",
    price: 34000,
    submittedAt: "2026-05-07",
    status: "pending_review",
  },
  {
    id: "mod-010",
    title: "Stock photo scam listing",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&q=60",
    seller: "Suspicious Seller",
    sellerEmail: "scam@temp.xyz",
    price: 15000,
    submittedAt: "2026-05-07",
    status: "rejected",
    rejectReason: "Stock photos, suspicious pricing, unverified seller.",
  },
];

const statusStyles: Record<ModerationStatus, string> = {
  pending_review: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusLabels: Record<ModerationStatus, string> = {
  pending_review: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export default function ModerationPage() {
  const [items, setItems] = useState(moderationItems);
  const [filter, setFilter] = useState<ModerationStatus | "all">("all");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const filtered =
    filter === "all" ? items : items.filter((i) => i.status === filter);

  const pendingCount = items.filter(
    (i) => i.status === "pending_review"
  ).length;

  function handleApprove(id: string) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "approved" as const } : i))
    );
  }

  function handleReject(id: string) {
    if (rejectingId === id && rejectReason.trim()) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                status: "rejected" as const,
                rejectReason: rejectReason.trim(),
              }
            : i
        )
      );
      setRejectingId(null);
      setRejectReason("");
    } else {
      setRejectingId(id);
      setRejectReason("");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">Moderation Queue</h2>
          <p className="text-sm text-stone-500">
            {pendingCount} listing{pendingCount !== 1 ? "s" : ""} pending review
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-stone-400" />
          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as ModerationStatus | "all")
            }
            className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-700 outline-none focus:border-stone-400"
          >
            <option value="all">All ({items.length})</option>
            <option value="pending_review">
              Pending ({items.filter((i) => i.status === "pending_review").length})
            </option>
            <option value="approved">
              Approved ({items.filter((i) => i.status === "approved").length})
            </option>
            <option value="rejected">
              Rejected ({items.filter((i) => i.status === "rejected").length})
            </option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
              <th className="px-4 py-3">Photo</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Seller</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-stone-50">
                <td className="px-4 py-2">
                  <div className="relative h-10 w-14 overflow-hidden rounded bg-stone-200">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                </td>
                <td className="px-4 py-2">
                  <p className="font-medium text-stone-900">{item.title}</p>
                  <p className="font-mono text-xs text-stone-400">{item.id}</p>
                </td>
                <td className="px-4 py-2">
                  <p className="text-stone-700">{item.seller}</p>
                  <p className="text-xs text-stone-400">{item.sellerEmail}</p>
                </td>
                <td className="px-4 py-2 text-right font-medium text-stone-900">
                  &euro;{item.price.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-stone-500">{item.submittedAt}</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyles[item.status]}`}
                  >
                    {statusLabels[item.status]}
                  </span>
                  {item.rejectReason && (
                    <p className="mt-1 max-w-48 text-xs text-red-600">
                      {item.rejectReason}
                    </p>
                  )}
                </td>
                <td className="px-4 py-2 text-right">
                  {item.status === "pending_review" ? (
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2.5 py-1.5 text-xs font-medium text-green-700 transition-colors hover:bg-green-100"
                        title="Approve"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-100"
                        title="Reject"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                      </button>
                      <button
                        className="inline-flex items-center rounded-md px-2 py-1.5 text-xs text-stone-500 transition-colors hover:bg-stone-100"
                        title="View details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-stone-400">--</span>
                  )}
                  {rejectingId === item.id && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="Rejection reason..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="w-full rounded border border-red-200 px-2 py-1 text-xs outline-none focus:border-red-400"
                        autoFocus
                      />
                      <button
                        onClick={() => handleReject(item.id)}
                        disabled={!rejectReason.trim()}
                        className="shrink-0 rounded bg-red-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-40"
                      >
                        Send
                      </button>
                      <button
                        onClick={() => setRejectingId(null)}
                        className="shrink-0 rounded px-2 py-1 text-xs text-stone-500 hover:bg-stone-100"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-stone-400">
            No listings match the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}
