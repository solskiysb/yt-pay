"use client";

import { useState } from "react";
import { Save, User } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  bio: string;
}

export default function ProfilePage() {
  const [form, setForm] = useState<ProfileData>({
    fullName: "Max Mustermann",
    email: "max@klassik-stuttgart.de",
    phone: "+49 711 555 0101",
    city: "Stuttgart",
    country: "Germany",
    bio: "Classic car enthusiast and dealer specializing in air-cooled Porsches and vintage European sports cars. Over 20 years of experience in the collector car market.",
  });

  const [saved, setSaved] = useState(false);

  const update = (field: keyof ProfileData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-stone-900">
          Profile Settings
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Manage your seller profile information
        </p>
      </div>

      {/* Avatar section */}
      <div className="flex items-center gap-4 rounded-xl bg-white p-6 ring-1 ring-stone-200">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <User className="size-7" />
        </div>
        <div>
          <p className="font-semibold text-stone-900">{form.fullName}</p>
          <p className="text-sm text-stone-500">Seller account</p>
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
            <div className="sm:col-span-2">
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
          </div>
        </div>

        {/* Location */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-400">
            Location
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">
                City
              </label>
              <Input
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
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
                className="h-9"
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-400">
            About
          </h3>
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Bio
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => update("bio", e.target.value)}
              rows={4}
              placeholder="Tell buyers about yourself and your experience with classic cars..."
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 transition-colors placeholder:text-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
            />
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
          className="inline-flex h-11 items-center gap-2 rounded-full bg-amber-500 px-6 text-sm font-medium text-stone-900 transition-colors hover:bg-amber-400"
        >
          <Save className="size-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
}
