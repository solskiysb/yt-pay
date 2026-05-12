"use client";

import { useState } from "react";
import { Shield, Ban, CheckCircle, MoreHorizontal } from "lucide-react";

type UserRole = "admin" | "seller" | "buyer";
type UserStatus = "active" | "banned";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  listingsCount: number;
  status: UserStatus;
  joinedAt: string;
  verified: boolean;
}

const mockUsers: AdminUser[] = [
  {
    id: "usr-001",
    name: "Anna Schneider",
    email: "anna@klassik-stuttgart.de",
    role: "seller",
    listingsCount: 12,
    status: "active",
    joinedAt: "2026-01-15",
    verified: true,
  },
  {
    id: "usr-002",
    name: "Marco Bianchi",
    email: "marco@rossocorsa.it",
    role: "seller",
    listingsCount: 8,
    status: "active",
    joinedAt: "2026-02-03",
    verified: true,
  },
  {
    id: "usr-003",
    name: "James Whitfield",
    email: "james@bhm.co.uk",
    role: "seller",
    listingsCount: 5,
    status: "active",
    joinedAt: "2026-02-18",
    verified: true,
  },
  {
    id: "usr-004",
    name: "Sergey Volkov",
    email: "admin@yt-pay.io",
    role: "admin",
    listingsCount: 0,
    status: "active",
    joinedAt: "2025-12-01",
    verified: true,
  },
  {
    id: "usr-005",
    name: "Pierre Dupont",
    email: "pierre.dupont@free.fr",
    role: "buyer",
    listingsCount: 0,
    status: "active",
    joinedAt: "2026-03-10",
    verified: false,
  },
  {
    id: "usr-006",
    name: "Hans Weber",
    email: "hans@hbg-classics.de",
    role: "seller",
    listingsCount: 3,
    status: "active",
    joinedAt: "2026-03-22",
    verified: true,
  },
  {
    id: "usr-007",
    name: "Suspicious Seller",
    email: "scam@temp.xyz",
    role: "seller",
    listingsCount: 1,
    status: "banned",
    joinedAt: "2026-04-01",
    verified: false,
  },
  {
    id: "usr-008",
    name: "Erik Johansson",
    email: "erik.j@gmail.com",
    role: "buyer",
    listingsCount: 0,
    status: "active",
    joinedAt: "2026-04-05",
    verified: true,
  },
  {
    id: "usr-009",
    name: "Maria Garcia",
    email: "maria.g@outlook.es",
    role: "buyer",
    listingsCount: 0,
    status: "active",
    joinedAt: "2026-04-12",
    verified: false,
  },
  {
    id: "usr-010",
    name: "Luca Rossi",
    email: "luca@concours.de",
    role: "seller",
    listingsCount: 15,
    status: "active",
    joinedAt: "2026-01-28",
    verified: true,
  },
  {
    id: "usr-011",
    name: "Thomas Muller",
    email: "t.muller@web.de",
    role: "buyer",
    listingsCount: 0,
    status: "active",
    joinedAt: "2026-04-20",
    verified: true,
  },
  {
    id: "usr-012",
    name: "Kenji Tanaka",
    email: "kenji@jdm-legends.eu",
    role: "seller",
    listingsCount: 6,
    status: "active",
    joinedAt: "2026-02-14",
    verified: true,
  },
  {
    id: "usr-013",
    name: "Sophie Martin",
    email: "sophie.m@proton.me",
    role: "buyer",
    listingsCount: 0,
    status: "active",
    joinedAt: "2026-05-01",
    verified: false,
  },
  {
    id: "usr-014",
    name: "Quick Flip Guy",
    email: "qf@motors.com",
    role: "seller",
    listingsCount: 2,
    status: "banned",
    joinedAt: "2026-03-30",
    verified: false,
  },
];

const roleBadgeStyles: Record<UserRole, string> = {
  admin: "bg-red-100 text-red-700",
  seller: "bg-blue-100 text-blue-700",
  buyer: "bg-stone-100 text-stone-600",
};

const statusBadgeStyles: Record<UserStatus, string> = {
  active: "bg-green-100 text-green-700",
  banned: "bg-red-100 text-red-700",
};

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);

  function toggleBan(id: string) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              status: (u.status === "active" ? "banned" : "active") as UserStatus,
            }
          : u
      )
    );
  }

  function toggleVerify(id: string) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, verified: !u.verified } : u
      )
    );
  }

  function changeRole(id: string, role: UserRole) {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role } : u))
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-stone-900">Users</h2>
        <p className="text-sm text-stone-500">{users.length} registered users</p>
      </div>

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
              <tr key={user.id} className="hover:bg-stone-50">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-200 text-xs font-semibold text-stone-600">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-stone-900">{user.name}</p>
                      <p className="font-mono text-xs text-stone-400">
                        {user.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-stone-600">{user.email}</td>
                <td className="px-4 py-2.5">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      changeRole(user.id, e.target.value as UserRole)
                    }
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold outline-none ${roleBadgeStyles[user.role]}`}
                  >
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-stone-700">
                  {user.listingsCount}
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusBadgeStyles[user.status]}`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-stone-500">{user.joinedAt}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => toggleVerify(user.id)}
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
                        user.verified
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-stone-50 text-stone-500 hover:bg-stone-100"
                      }`}
                      title={user.verified ? "Verified" : "Verify"}
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      {user.verified ? "Verified" : "Verify"}
                    </button>
                    <button
                      onClick={() => toggleBan(user.id)}
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
                        user.status === "banned"
                          ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                          : "bg-red-50 text-red-700 hover:bg-red-100"
                      }`}
                      title={user.status === "banned" ? "Unban" : "Ban"}
                    >
                      {user.status === "banned" ? (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
