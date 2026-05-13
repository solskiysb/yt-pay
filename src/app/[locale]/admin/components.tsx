"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  CheckCircle,
  XCircle,
  Eye,
  Star,
  StarOff,
  Shield,
  Ban,
  Filter,
} from "lucide-react";
import {
  approveListing,
  rejectListing,
  toggleFeatured,
  toggleBan,
  toggleVerified,
  changeUserRole,
} from "./actions";

/* ------------------------------------------------------------------ */
/*  Moderation                                                         */
/* ------------------------------------------------------------------ */

interface ModerationItem {
  id: string;
  title: string;
  image: string | null;
  seller_name: string | null;
  price: number;
  created_at: string;
  status: string;
  rejection_reason: string | null;
}

export function ModerationTable({ items }: { items: ModerationItem[] }) {
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all" ? items : items.filter((i) => i.status === filter);

  const statusStyles: Record<string, string> = {
    pending_review: "bg-amber-100 text-amber-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const statusLabels: Record<string, string> = {
    pending_review: "Pending",
    approved: "Approved",
    rejected: "Rejected",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">
            Moderation Queue
          </h2>
          <p className="text-sm text-stone-500">
            {items.filter((i) => i.status === "pending_review").length} listing
            {items.filter((i) => i.status === "pending_review").length !== 1
              ? "s"
              : ""}{" "}
            pending review
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-stone-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-700 outline-none focus:border-stone-400"
          >
            <option value="all">All ({items.length})</option>
            <option value="pending_review">
              Pending (
              {items.filter((i) => i.status === "pending_review").length})
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
              <ModerationRow
                key={item.id}
                item={item}
                statusStyles={statusStyles}
                statusLabels={statusLabels}
              />
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-stone-400">
            {items.length === 0
              ? "All caught up! No listings to review."
              : "No listings match the selected filter."}
          </div>
        )}
      </div>
    </div>
  );
}

function ModerationRow({
  item,
  statusStyles,
  statusLabels,
}: {
  item: ModerationItem;
  statusStyles: Record<string, string>;
  statusLabels: Record<string, string>;
}) {
  const [isPending, startTransition] = useTransition();
  const [rejectingId, setRejectingId] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  function handleApprove() {
    startTransition(async () => {
      await approveListing(item.id);
    });
  }

  function handleReject() {
    if (rejectingId && rejectReason.trim()) {
      startTransition(async () => {
        await rejectListing(item.id, rejectReason.trim());
        setRejectingId(false);
        setRejectReason("");
      });
    } else {
      setRejectingId(true);
      setRejectReason("");
    }
  }

  const date = new Date(item.created_at).toISOString().split("T")[0];

  return (
    <tr className={`hover:bg-stone-50 ${isPending ? "opacity-50" : ""}`}>
      <td className="px-4 py-2">
        <div className="relative h-10 w-14 overflow-hidden rounded bg-stone-200">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-stone-400">
              --
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-2">
        <p className="font-medium text-stone-900">{item.title}</p>
        <p className="font-mono text-xs text-stone-400">
          {item.id.slice(0, 8)}
        </p>
      </td>
      <td className="px-4 py-2 text-stone-700">
        {item.seller_name ?? "Unknown"}
      </td>
      <td className="px-4 py-2 text-right font-medium text-stone-900">
        &euro;{item.price.toLocaleString()}
      </td>
      <td className="px-4 py-2 text-stone-500">{date}</td>
      <td className="px-4 py-2">
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyles[item.status] ?? "bg-stone-100 text-stone-500"}`}
        >
          {statusLabels[item.status] ?? item.status}
        </span>
        {item.rejection_reason && (
          <p className="mt-1 max-w-48 text-xs text-red-600">
            {item.rejection_reason}
          </p>
        )}
      </td>
      <td className="px-4 py-2 text-right">
        {item.status === "pending_review" ? (
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleApprove}
                disabled={isPending}
                className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2.5 py-1.5 text-xs font-medium text-green-700 transition-colors hover:bg-green-100 disabled:opacity-40"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Approve
              </button>
              <button
                onClick={handleReject}
                disabled={isPending}
                className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-40"
              >
                <XCircle className="h-3.5 w-3.5" />
                Reject
              </button>
            </div>
            {rejectingId && (
              <div className="mt-1 flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="Rejection reason..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full rounded border border-red-200 px-2 py-1 text-xs outline-none focus:border-red-400"
                  autoFocus
                />
                <button
                  onClick={handleReject}
                  disabled={!rejectReason.trim() || isPending}
                  className="shrink-0 rounded bg-red-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-40"
                >
                  Send
                </button>
                <button
                  onClick={() => setRejectingId(false)}
                  className="shrink-0 rounded px-2 py-1 text-xs text-stone-500 hover:bg-stone-100"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ) : (
          <span className="text-xs text-stone-400">--</span>
        )}
      </td>
    </tr>
  );
}

/* ------------------------------------------------------------------ */
/*  Users                                                              */
/* ------------------------------------------------------------------ */

interface UserItem {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  is_verified: boolean;
  is_banned: boolean;
  created_at: string;
  listings_count: number;
}

const roleBadgeStyles: Record<string, string> = {
  admin: "bg-red-100 text-red-700",
  seller: "bg-blue-100 text-blue-700",
  buyer: "bg-stone-100 text-stone-600",
};

export function UsersTable({ users }: { users: UserItem[] }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-stone-900">Users</h2>
        <p className="text-sm text-stone-500">
          {users.length} registered user{users.length !== 1 ? "s" : ""}
        </p>
      </div>

      {users.length === 0 ? (
        <div className="rounded-lg border border-stone-200 bg-white px-4 py-12 text-center text-sm text-stone-400">
          No users yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 text-right">Listings</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {users.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function UserRow({ user }: { user: UserItem }) {
  const [isPending, startTransition] = useTransition();
  const name = user.full_name ?? "No name";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const date = new Date(user.created_at).toISOString().split("T")[0];

  function handleToggleBan() {
    startTransition(async () => {
      await toggleBan(user.id, !user.is_banned);
    });
  }

  function handleToggleVerified() {
    startTransition(async () => {
      await toggleVerified(user.id, !user.is_verified);
    });
  }

  function handleRoleChange(role: string) {
    startTransition(async () => {
      await changeUserRole(user.id, role);
    });
  }

  return (
    <tr className={`hover:bg-stone-50 ${isPending ? "opacity-50" : ""}`}>
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-200 text-xs font-semibold text-stone-600">
            {initials}
          </div>
          <div>
            <p className="font-medium text-stone-900">{name}</p>
            <p className="font-mono text-xs text-stone-400">
              {user.id.slice(0, 8)}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-2.5 text-stone-600">
        {user.email ?? "No email"}
      </td>
      <td className="px-4 py-2.5">
        <select
          value={user.role}
          onChange={(e) => handleRoleChange(e.target.value)}
          disabled={isPending}
          className={`rounded-full px-2 py-0.5 text-xs font-semibold outline-none ${roleBadgeStyles[user.role] ?? "bg-stone-100 text-stone-600"}`}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>
      </td>
      <td className="px-4 py-2.5 text-right font-mono text-stone-700">
        {user.listings_count}
      </td>
      <td className="px-4 py-2.5">
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
            user.is_banned
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {user.is_banned ? "banned" : "active"}
        </span>
      </td>
      <td className="px-4 py-2.5 text-stone-500">{date}</td>
      <td className="px-4 py-2.5">
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={handleToggleVerified}
            disabled={isPending}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
              user.is_verified
                ? "bg-green-50 text-green-700 hover:bg-green-100"
                : "bg-stone-50 text-stone-500 hover:bg-stone-100"
            } disabled:opacity-40`}
            title={user.is_verified ? "Verified" : "Verify"}
          >
            <CheckCircle className="h-3.5 w-3.5" />
            {user.is_verified ? "Verified" : "Verify"}
          </button>
          <button
            onClick={handleToggleBan}
            disabled={isPending}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
              user.is_banned
                ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                : "bg-red-50 text-red-700 hover:bg-red-100"
            } disabled:opacity-40`}
            title={user.is_banned ? "Unban" : "Ban"}
          >
            {user.is_banned ? (
              <>
                <Shield className="h-3.5 w-3.5" />
                Unban
              </>
            ) : (
              <>
                <Ban className="h-3.5 w-3.5" />
                Ban
              </>
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ------------------------------------------------------------------ */
/*  Listings                                                           */
/* ------------------------------------------------------------------ */

interface ListingItem {
  id: string;
  title: string;
  image: string | null;
  seller_name: string | null;
  price: number;
  status: string;
  is_featured: boolean;
  views_count: number;
  contacts_count: number;
  created_at: string;
  slug: string;
}

const listingStatusStyles: Record<string, string> = {
  approved: "bg-green-100 text-green-700",
  sold: "bg-blue-100 text-blue-700",
  draft: "bg-stone-100 text-stone-500",
  pending_review: "bg-amber-100 text-amber-700",
  pending_payment: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
  archived: "bg-stone-100 text-stone-500",
};

const listingStatusLabels: Record<string, string> = {
  approved: "Active",
  sold: "Sold",
  draft: "Draft",
  pending_review: "Pending",
  pending_payment: "Payment",
  rejected: "Rejected",
  archived: "Archived",
};

export function ListingsTable({ listings }: { listings: ListingItem[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">All Listings</h2>
          <p className="text-sm text-stone-500">
            {listings.length} listing{listings.length !== 1 ? "s" : ""} &middot;{" "}
            {listings.filter((l) => l.is_featured).length} featured
          </p>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-lg border border-stone-200 bg-white px-4 py-12 text-center text-sm text-stone-400">
          No listings yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
                <th className="px-4 py-3">Photo</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Seller</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Featured</th>
                <th className="px-4 py-3 text-right">Views</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {listings.map((listing) => (
                <ListingRow key={listing.id} listing={listing} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ListingRow({ listing }: { listing: ListingItem }) {
  const [isPending, startTransition] = useTransition();
  const date = new Date(listing.created_at).toISOString().split("T")[0];

  function handleToggleFeatured() {
    startTransition(async () => {
      await toggleFeatured(listing.id, !listing.is_featured);
    });
  }

  return (
    <tr className={`hover:bg-stone-50 ${isPending ? "opacity-50" : ""}`}>
      <td className="px-4 py-2">
        <div className="relative h-10 w-14 overflow-hidden rounded bg-stone-200">
          {listing.image ? (
            <Image
              src={listing.image}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-stone-400">
              --
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-2">
        <p className="font-medium text-stone-900">{listing.title}</p>
        <p className="font-mono text-xs text-stone-400">{listing.slug}</p>
      </td>
      <td className="px-4 py-2 text-stone-700">
        {listing.seller_name ?? "Unknown"}
      </td>
      <td className="px-4 py-2 text-right font-medium text-stone-900">
        &euro;{listing.price.toLocaleString()}
      </td>
      <td className="px-4 py-2">
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${listingStatusStyles[listing.status] ?? "bg-stone-100 text-stone-500"}`}
        >
          {listingStatusLabels[listing.status] ?? listing.status}
        </span>
      </td>
      <td className="px-4 py-2 text-center">
        <button
          onClick={handleToggleFeatured}
          disabled={isPending}
          className={`inline-flex items-center justify-center rounded-md p-1.5 transition-colors disabled:opacity-40 ${
            listing.is_featured
              ? "text-amber-500 hover:bg-amber-50"
              : "text-stone-300 hover:bg-stone-100 hover:text-stone-500"
          }`}
          title={listing.is_featured ? "Remove featured" : "Make featured"}
        >
          {listing.is_featured ? (
            <Star className="h-4 w-4 fill-current" />
          ) : (
            <StarOff className="h-4 w-4" />
          )}
        </button>
      </td>
      <td className="px-4 py-2 text-right">
        <span className="inline-flex items-center gap-1 font-mono text-xs text-stone-500">
          <Eye className="h-3 w-3" />
          {listing.views_count.toLocaleString()}
        </span>
      </td>
      <td className="px-4 py-2 text-stone-500">{date}</td>
    </tr>
  );
}
