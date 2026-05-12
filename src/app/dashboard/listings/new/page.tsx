"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Upload, X, Plus, Loader2 } from "lucide-react";
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

const MAX_PHOTOS = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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

interface PhotoPreview {
  file: File;
  previewUrl: string;
}

function generateSlug(make: string, model: string, year: string): string {
  const base = `${make}-${model}-${year}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const suffix = Math.random().toString(36).substring(2, 8);
  return `${base}-${suffix}`;
}

export default function NewListingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

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

  const handleFilesSelected = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const newFiles: PhotoPreview[] = [];
      const remaining = MAX_PHOTOS - photos.length;

      for (let i = 0; i < Math.min(files.length, remaining); i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) continue;
        if (file.size > MAX_FILE_SIZE) {
          setError(`File "${file.name}" exceeds 10MB limit`);
          continue;
        }
        newFiles.push({
          file,
          previewUrl: URL.createObjectURL(file),
        });
      }

      if (files.length > remaining) {
        setError(`Maximum ${MAX_PHOTOS} photos allowed. Only first ${remaining} were added.`);
      }

      setPhotos((prev) => [...prev, ...newFiles]);
    },
    [photos.length]
  );

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const removed = prev[index];
      URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFilesSelected(e.dataTransfer.files);
    },
    [handleFilesSelected]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const validate = (): string | null => {
    if (!form.make) return "Please select a make";
    if (!form.model.trim()) return "Please enter a model";
    if (!form.year || Number(form.year) < 1900) return "Please enter a valid year";
    if (!form.price || Number(form.price) <= 0) return "Please enter a valid price";
    if (!form.mileage) return "Please enter mileage";
    if (!form.location.trim()) return "Please enter a location";
    if (!form.shortDescription.trim()) return "Please enter a short description";
    if (!form.description.trim()) return "Please enter a description";
    return null;
  };

  const handleSubmit = async (action: "draft" | "review") => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);
    setUploadProgress(0);

    try {
      const supabase = createClient();

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in to create a listing");
        setSaving(false);
        return;
      }

      const slug = generateSlug(form.make, form.model, form.year);

      // Insert listing
      const { data: listing, error: insertError } = await supabase
        .from("listings")
        .insert({
          seller_id: user.id,
          slug,
          make: form.make,
          model: form.model,
          year: Number(form.year),
          price: Number(form.price),
          mileage: Number(form.mileage),
          location: form.location,
          description: form.description,
          short_description: form.shortDescription,
          condition: form.condition,
          engine: form.engine || null,
          transmission: form.transmission || null,
          drivetrain: form.drivetrain || null,
          exterior_color: form.exteriorColor || null,
          interior_color: form.interiorColor || null,
          body_type: form.bodyType || null,
          features: form.features,
          status: "draft",
        })
        .select("id")
        .single();

      if (insertError || !listing) {
        throw new Error(insertError?.message ?? "Failed to create listing");
      }

      // Upload photos
      if (photos.length > 0) {
        const imageRecords: {
          listing_id: string;
          url: string;
          storage_path: string;
          sort_order: number;
          is_primary: boolean;
        }[] = [];

        for (let i = 0; i < photos.length; i++) {
          const photo = photos[i];
          const ext = photo.file.name.split(".").pop() ?? "jpg";
          const fileName = `${Date.now()}-${i}.${ext}`;
          const storagePath = `${user.id}/${listing.id}/${fileName}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("listing-photos")
            .upload(storagePath, photo.file, {
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) {
            throw new Error(`Failed to upload photo ${i + 1}: ${uploadError.message}`);
          }

          const {
            data: { publicUrl },
          } = supabase.storage.from("listing-photos").getPublicUrl(uploadData.path);

          imageRecords.push({
            listing_id: listing.id,
            url: publicUrl,
            storage_path: storagePath,
            sort_order: i,
            is_primary: i === 0,
          });

          setUploadProgress(Math.round(((i + 1) / photos.length) * 100));
        }

        const { error: imagesError } = await supabase
          .from("listing_images")
          .insert(imageRecords);

        if (imagesError) {
          throw new Error(`Failed to save image records: ${imagesError.message}`);
        }
      }

      router.push("/dashboard/listings");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setSaving(false);
    }
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

      {/* Photos */}
      <section className="rounded-xl bg-white p-6 ring-1 ring-stone-200">
        <h3 className="font-heading text-lg font-semibold text-stone-900">
          Photos
        </h3>
        <p className="mt-1 text-sm text-stone-500">
          Upload up to {MAX_PHOTOS} high-quality photos of your car
        </p>

        {/* Photo previews */}
        {photos.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {photos.map((photo, index) => (
              <div
                key={photo.previewUrl}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-100"
              >
                <Image
                  src={photo.previewUrl}
                  alt={`Photo ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {index === 0 && (
                  <span className="absolute left-1.5 top-1.5 rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-semibold text-stone-900">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload zone */}
        {photos.length < MAX_PHOTOS && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="mt-4 flex items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 px-6 py-12 transition-colors hover:border-amber-400 hover:bg-amber-50/30"
          >
            <div className="text-center">
              <Upload className="mx-auto size-8 text-stone-400" />
              <p className="mt-3 text-sm font-medium text-stone-700">
                Drag and drop photos here
              </p>
              <p className="mt-1 text-xs text-stone-400">
                PNG, JPG up to 10MB each ({photos.length}/{MAX_PHOTOS} uploaded)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFilesSelected(e.target.files)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-200"
              >
                <Plus className="size-3.5" />
                Browse Files
              </button>
            </div>
          </div>
        )}
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

      {/* Upload progress */}
      {saving && photos.length > 0 && uploadProgress < 100 && (
        <div className="rounded-lg bg-amber-50 px-4 py-3">
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-medium text-amber-800">Uploading photos...</span>
            <span className="text-amber-600">{uploadProgress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-amber-200">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Submit */}
      <div className="flex flex-col gap-3 pb-8 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => handleSubmit("draft")}
          disabled={saving}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-stone-300 px-6 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 disabled:opacity-50"
        >
          {saving && <Loader2 className="size-4 animate-spin" />}
          Save as Draft
        </button>
        <button
          type="button"
          onClick={() => handleSubmit("review")}
          disabled={saving}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-amber-500 px-6 text-sm font-medium text-stone-900 transition-colors hover:bg-amber-400 disabled:opacity-50"
        >
          {saving && <Loader2 className="size-4 animate-spin" />}
          Submit for Review
        </button>
      </div>
    </div>
  );
}
