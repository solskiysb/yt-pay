"use client";

import { useState, useEffect } from "react";
import { Save, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
}

export default function BuyerProfilePage() {
  const [form, setForm] = useState<ProfileData>({
    fullName: "",
    email: "",
    phone: "",
    country: "",
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, phone, country")
        .eq("id", user.id)
        .single();

      setForm({
        fullName: profile?.display_name ?? user.user_metadata?.full_name ?? "",
        email: user.email ?? "",
        phone: profile?.phone ?? "",
        country: profile?.country ?? "",
      });
      setLoading(false);
    });
  }, []);

  const update = (field: keyof ProfileData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    setSaving(true);
    await supabase
      .from("profiles")
      .update({
        display_name: form.fullName,
        phone: form.phone,
        country: form.country,
      })
      .eq("id", user.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-stone-200" />
        <div className="h-64 animate-pulse rounded-xl bg-stone-200" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-stone-900">
          Profile Settings
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Manage your account information
        </p>
      </div>

      {/* Avatar section */}
      <div className="flex items-center gap-4 rounded-xl bg-white p-6 ring-1 ring-stone-200">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <User className="size-7" />
        </div>
        <div>
          <p className="font-semibold text-stone-900">
            {form.fullName || "User"}
          </p>
          <p className="text-sm text-stone-500">Buyer account</p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6 rounded-xl bg-white p-6 ring-1 ring-stone-200">
        {/* Personal info */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-400">
            Personal Information
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-stone-700">
                Full Name
              </label>
              <Input
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                className="h-9"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-stone-700">
                Email
              </label>
              <Input
                value={form.email}
                disabled
                className="h-9 bg-stone-50 text-stone-400"
              />
              <p className="mt-1 text-xs text-stone-400">
                Email cannot be changed here
              </p>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">
                Phone
              </label>
              <Input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+49 ..."
                className="h-9"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">
                Country
              </label>
              <Input
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
                placeholder="e.g. Germany"
                className="h-9"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center justify-end gap-3 pb-8">
        {saved && (
          <span className="text-sm font-medium text-emerald-600">
            Profile saved successfully
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-amber-500 px-6 text-sm font-medium text-stone-900 transition-colors hover:bg-amber-400 disabled:opacity-50"
        >
          <Save className="size-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
