"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const carMakes = [
  "Alfa Romeo",
  "Aston Martin",
  "Audi",
  "Austin-Healey",
  "Bentley",
  "BMW",
  "Bugatti",
  "Chevrolet",
  "Citroën",
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

export default function NewListingPage() {
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

  const [featureInput, setFeatureInput] = useState("");

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

  const handleSubmit = (action: "draft" | "review") => {
    const label = action === "draft" ? "draft" : "review";
    alert(
      `Listing saved as ${label}.\n\n${form.year} ${form.make} ${form.model}\nPrice: ${form.price}\n\nThis will connect to Supabase later.`
    );
  };

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
            Create New Listing
          </h2>
          <p className="mt-0.5 text-sm text-stone-500">
            Fill in the details to list your car
          </p>
        </div>
      </div>

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

      {/* Photos */}
      <section className="rounded-xl bg-white p-6 ring-1 ring-stone-200">
        <h3 className="font-heading text-lg font-semibold text-stone-900">
          Photos
        </h3>
        <p className="mt-1 text-sm text-stone-500">
          Upload up to 20 high-quality photos of your car
        </p>
        <div className="mt-5 flex items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 px-6 py-12 transition-colors hover:border-amber-400 hover:bg-amber-50/30">
          <div className="text-center">
            <Upload className="mx-auto size-8 text-stone-400" />
            <p className="mt-3 text-sm font-medium text-stone-700">
              Drag and drop photos here
            </p>
            <p className="mt-1 text-xs text-stone-400">
              PNG, JPG up to 10MB each
            </p>
            <button
              type="button"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-200"
            >
              <Plus className="size-3.5" />
              Browse Files
            </button>
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
        <button
          type="button"
          onClick={() => handleSubmit("draft")}
          className="inline-flex h-11 items-center justify-center rounded-full border border-stone-300 px-6 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100"
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={() => handleSubmit("review")}
          className="inline-flex h-11 items-center justify-center rounded-full bg-amber-500 px-6 text-sm font-medium text-stone-900 transition-colors hover:bg-amber-400"
        >
          Submit for Review
        </button>
      </div>
    </div>
  );
}
