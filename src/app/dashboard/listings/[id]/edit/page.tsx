"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

const carMakes = [
  "Alfa Romeo",
  "Aston Martin",
  "Audi",
  "Austin-Healey",
  "Bentley",
  "BMW",
  "Bugatti",
  "Chevrolet",
  "Citroen",
  "Datsun",
  "De Tomaso",
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
  "Morgan",
  "Opel",
  "Peugeot",
  "Porsche",
  "Renault",
  "Rolls-Royce",
  "Saab",
  "Toyota",
  "Triumph",
  "Volkswagen",
  "Volvo",
];

const transmissions = ["Manual", "Automatic"];
const drivetrains = ["RWD", "FWD", "AWD"];
const conditions = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
];
const bodyTypes = [
  "Coupe",
  "Sedan",
  "Convertible",
  "Wagon",
  "SUV",
  "Roadster",
  "Hatchback",
  "Targa",
  "Shooting Brake",
];

interface FormData {
  make: string;
  model: string;
  year: string;
  price: string;
  mileage: string;
  location: string;
  engine: string;
  transmission: string;
  drivetrain: string;
  exteriorColor: string;
  interiorColor: string;
  bodyType: string;
  description: string;
  shortDescription: string;
  condition: string;
  features: string[];
}

export default function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [featureInput, setFeatureInput] = useState("");

  const [form, setForm] = useState<FormData>({
    make: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    location: "",
    engine: "",
    transmission: "Manual",
    drivetrain: "RWD",
    exteriorColor: "",
    interiorColor: "",
    bodyType: "Coupe",
    description: "",
    shortDescription: "",
    condition: "good",
    features: [],
  });

  useEffect(() => {
    async function fetchListing() {
      // Verify the user owns this listing
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .eq("seller_id", user.id)
        .single();

      if (fetchError || !data) {
        setError("Listing not found or you do not have permission to edit it.");
        setLoading(false);
        return;
      }

      setForm({
        make: data.make ?? "",
        model: data.model ?? "",
        year: String(data.year ?? ""),
        price: String(data.price ?? ""),
        mileage: String(data.mileage ?? ""),
        location: data.location ?? "",
        engine: data.engine ?? "",
        transmission: data.transmission ?? "Manual",
        drivetrain: data.drivetrain ?? "RWD",
        exteriorColor: data.exterior_color ?? "",
        interiorColor: data.interior_color ?? "",
        bodyType: data.body_type ?? "Coupe",
        description: data.description ?? "",
        shortDescription: data.short_description ?? "",
        condition: data.condition ?? "good",
        features: data.features ?? [],
      });
      setLoading(false);
    }

    fetchListing();
  }, [id, router, supabase]);

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addFeature = () => {
    const trimmed = featureInput.trim();
    if (trimmed && !form.features.includes(trimmed)) {
      setForm((prev) => ({ ...prev, features: [...prev.features, trimmed] }));
      setFeatureInput("");
    }
  };

  const removeFeature = (feature: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    const { error: updateError } = await supabase
      .from("listings")
      .update({
        make: form.make,
        model: form.model,
        year: Number(form.year),
        price: Number(form.price),
        mileage: Number(form.mileage),
        location: form.location,
        engine: form.engine || null,
        transmission: form.transmission || null,
        drivetrain: form.drivetrain || null,
        exterior_color: form.exteriorColor || null,
        interior_color: form.interiorColor || null,
        body_type: form.bodyType || null,
        description: form.description,
        short_description: form.shortDescription,
        condition: form.condition,
        features: form.features,
      })
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    router.push("/dashboard/listings");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-stone-400" />
      </div>
    );
  }

  if (error && !form.make) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Link
          href="/dashboard/listings"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
        >
          <ArrowLeft className="size-4" />
          Back to Listings
        </Link>
        <div className="rounded-xl bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/listings"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-stone-200 hover:text-stone-600"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h2 className="font-heading text-2xl font-bold text-stone-900">
            Edit Listing
          </h2>
          <p className="mt-0.5 text-sm text-stone-500">
            Update the details of your listing
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Car Details */}
      <section className="rounded-xl bg-white p-6 ring-1 ring-stone-200">
        <h3 className="font-heading text-lg font-semibold text-stone-900">
          Car Details
        </h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Make
            </label>
            <select
              value={form.make}
              onChange={(e) => update("make", e.target.value)}
              className="h-9 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-900 transition-colors focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
            >
              <option value="">Select make...</option>
              {carMakes.map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Model
            </label>
            <Input
              value={form.model}
              onChange={(e) => update("model", e.target.value)}
              placeholder="e.g. 911 Carrera RS 2.7"
              className="h-9"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Year
            </label>
            <Input
              type="number"
              value={form.year}
              onChange={(e) => update("year", e.target.value)}
              placeholder="e.g. 1973"
              min={1900}
              max={2026}
              className="h-9"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Price (EUR)
            </label>
            <Input
              type="number"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              placeholder="e.g. 178000"
              min={0}
              className="h-9"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Mileage (km)
            </label>
            <Input
              type="number"
              value={form.mileage}
              onChange={(e) => update("mileage", e.target.value)}
              placeholder="e.g. 74200"
              min={0}
              className="h-9"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Location
            </label>
            <Input
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="e.g. Stuttgart, Germany"
              className="h-9"
            />
          </div>
        </div>
      </section>

      {/* Specs */}
      <section className="rounded-xl bg-white p-6 ring-1 ring-stone-200">
        <h3 className="font-heading text-lg font-semibold text-stone-900">
          Specifications
        </h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Engine
            </label>
            <Input
              value={form.engine}
              onChange={(e) => update("engine", e.target.value)}
              placeholder="e.g. 2.7L Flat-6"
              className="h-9"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Transmission
            </label>
            <select
              value={form.transmission}
              onChange={(e) => update("transmission", e.target.value)}
              className="h-9 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-900 transition-colors focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
            >
              {transmissions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Drivetrain
            </label>
            <select
              value={form.drivetrain}
              onChange={(e) => update("drivetrain", e.target.value)}
              className="h-9 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-900 transition-colors focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
            >
              {drivetrains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Body Type
            </label>
            <select
              value={form.bodyType}
              onChange={(e) => update("bodyType", e.target.value)}
              className="h-9 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-900 transition-colors focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
            >
              {bodyTypes.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Exterior Color
            </label>
            <Input
              value={form.exteriorColor}
              onChange={(e) => update("exteriorColor", e.target.value)}
              placeholder="e.g. Grand Prix White"
              className="h-9"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Interior Color
            </label>
            <Input
              value={form.interiorColor}
              onChange={(e) => update("interiorColor", e.target.value)}
              placeholder="e.g. Black Leather"
              className="h-9"
            />
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="rounded-xl bg-white p-6 ring-1 ring-stone-200">
        <h3 className="font-heading text-lg font-semibold text-stone-900">
          Description
        </h3>
        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Short Description
            </label>
            <textarea
              value={form.shortDescription}
              onChange={(e) => update("shortDescription", e.target.value)}
              placeholder="One-line summary of your car..."
              rows={2}
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 transition-colors placeholder:text-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Full Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Describe the car's history, condition, any recent work done, ownership story..."
              rows={6}
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 transition-colors placeholder:text-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="rounded-xl bg-white p-6 ring-1 ring-stone-200">
        <h3 className="font-heading text-lg font-semibold text-stone-900">
          Features
        </h3>
        <p className="mt-1 text-sm text-stone-500">
          Add notable features and equipment
        </p>
        <div className="mt-4 flex gap-2">
          <Input
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addFeature();
              }
            }}
            placeholder="e.g. Sport seats"
            className="h-9 flex-1"
          />
          <button
            type="button"
            onClick={addFeature}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-stone-100 px-3 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-200"
          >
            <Plus className="size-3.5" />
            Add
          </button>
        </div>
        {form.features.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {form.features.map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-800"
              >
                {feature}
                <button
                  onClick={() => removeFeature(feature)}
                  className="flex h-4 w-4 items-center justify-center rounded-full text-amber-500 transition-colors hover:bg-amber-200 hover:text-amber-700"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Condition */}
      <section className="rounded-xl bg-white p-6 ring-1 ring-stone-200">
        <h3 className="font-heading text-lg font-semibold text-stone-900">
          Condition
        </h3>
        <div className="mt-4 flex flex-wrap gap-3">
          {conditions.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => update("condition", c.value)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                form.condition === c.value
                  ? "bg-amber-500 text-stone-900"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* Submit */}
      <div className="flex flex-col gap-3 pb-8 sm:flex-row sm:justify-end">
        <Link
          href="/dashboard/listings"
          className="inline-flex h-11 items-center justify-center rounded-full border border-stone-300 px-6 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100"
        >
          Cancel
        </Link>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-amber-500 px-6 text-sm font-medium text-stone-900 transition-colors hover:bg-amber-400 disabled:opacity-50"
        >
          {saving && <Loader2 className="size-4 animate-spin" />}
          Save Changes
        </button>
      </div>
    </div>
  );
}
