"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, Plus, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

interface SavedSearchCriteria {
  make?: string;
  model?: string;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
}

interface SavedSearch {
  id: string;
  criteria: SavedSearchCriteria;
  is_active: boolean;
  created_at: string;
}

const COMMON_MAKES = [
  "Alfa Romeo",
  "Aston Martin",
  "Audi",
  "BMW",
  "Bentley",
  "Chevrolet",
  "Citro\u00ebn",
  "Datsun",
  "Ferrari",
  "Fiat",
  "Ford",
  "Jaguar",
  "Lamborghini",
  "Lancia",
  "Land Rover",
  "Lotus",
  "Maserati",
  "Mercedes-Benz",
  "MG",
  "Opel",
  "Peugeot",
  "Porsche",
  "Renault",
  "Rolls-Royce",
  "Triumph",
  "Volkswagen",
  "Volvo",
];

function formatCriteria(criteria: SavedSearchCriteria): string {
  const parts: string[] = [];
  if (criteria.make) parts.push(criteria.make);
  if (criteria.model) parts.push(criteria.model);
  if (criteria.minYear || criteria.maxYear) {
    const from = criteria.minYear ?? "...";
    const to = criteria.maxYear ?? "...";
    parts.push(`${from}\u2013${to}`);
  }
  if (criteria.maxPrice) {
    parts.push(
      `up to ${new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }).format(criteria.maxPrice)}`
    );
  }
  return parts.length > 0 ? parts.join(" \u00b7 ") : "Any car";
}

export default function SavedSearchesPage() {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");

  const fetchSearches = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("saved_searches")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setSearches((data ?? []) as SavedSearch[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSearches();
  }, [fetchSearches]);

  const handleCreate = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const criteria: SavedSearchCriteria = {};
    if (make) criteria.make = make;
    if (model) criteria.model = model;
    if (maxPrice) criteria.maxPrice = Number(maxPrice);
    if (minYear) criteria.minYear = Number(minYear);
    if (maxYear) criteria.maxYear = Number(maxYear);

    setSaving(true);
    await supabase
      .from("saved_searches")
      .insert({ user_id: user.id, criteria });

    // Reset form
    setMake("");
    setModel("");
    setMaxPrice("");
    setMinYear("");
    setMaxYear("");
    setShowForm(false);
    setSaving(false);
    fetchSearches();
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    const supabase = createClient();
    await supabase
      .from("saved_searches")
      .update({ is_active: !currentActive })
      .eq("id", id);
    fetchSearches();
  };

  const deleteSearch = async (id: string) => {
    const supabase = createClient();
    await supabase.from("saved_searches").delete().eq("id", id);
    fetchSearches();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-stone-900">
            Saved Searches
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Get notified when matching cars are listed
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex h-9 items-center gap-2 rounded-full bg-amber-500 px-4 text-sm font-medium text-stone-900 transition-colors hover:bg-amber-400"
        >
          <Plus className="size-4" />
          New Alert
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="space-y-4 rounded-xl bg-white p-6 ring-1 ring-stone-200">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-400">
            New Search Alert
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">
                Make
              </label>
              <select
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="h-9 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-900 transition-colors focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
              >
                <option value="">Any make</option>
                {COMMON_MAKES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">
                Model
              </label>
              <Input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. 911"
                className="h-9"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">
                Max Price
              </label>
              <Input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="e.g. 150000"
                className="h-9"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">
                  Min Year
                </label>
                <Input
                  type="number"
                  value={minYear}
                  onChange={(e) => setMinYear(e.target.value)}
                  placeholder="1960"
                  className="h-9"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">
                  Max Year
                </label>
                <Input
                  type="number"
                  value={maxYear}
                  onChange={(e) => setMaxYear(e.target.value)}
                  placeholder="2000"
                  className="h-9"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowForm(false)}
              className="h-9 rounded-lg px-4 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={saving}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-amber-500 px-4 text-sm font-medium text-stone-900 transition-colors hover:bg-amber-400 disabled:opacity-50"
            >
              <Search className="size-3.5" />
              {saving ? "Saving..." : "Create Alert"}
            </button>
          </div>
        </div>
      )}

      {/* Saved searches list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl bg-stone-200"
            />
          ))}
        </div>
      ) : searches.length > 0 ? (
        <div className="space-y-3">
          {searches.map((search) => (
            <div
              key={search.id}
              className="flex items-center justify-between gap-4 rounded-xl bg-white p-4 ring-1 ring-stone-200"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-stone-900 truncate">
                  {formatCriteria(search.criteria)}
                </p>
                <p className="mt-0.5 text-xs text-stone-400">
                  Created{" "}
                  {new Date(search.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => toggleActive(search.id, search.is_active)}
                  className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-medium transition-colors ${
                    search.is_active
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                  }`}
                >
                  {search.is_active ? "Active" : "Paused"}
                </button>
                <button
                  onClick={() => deleteSearch(search.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  aria-label="Delete search"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl bg-white px-6 py-20 ring-1 ring-stone-200">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
            <Bell className="size-6 text-stone-400" />
          </div>
          <h3 className="mt-4 font-heading text-lg font-semibold text-stone-900">
            No saved searches yet
          </h3>
          <p className="mt-2 max-w-sm text-center text-sm text-stone-500">
            Set up alerts to get notified when matching cars are listed.
          </p>
        </div>
      )}
    </div>
  );
}
