"use client";

import { useState, useEffect, useRef, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Plus, X, Loader2, Upload } from "lucide-react";
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

interface ExistingImage {
  id: string;
  url: string;
  storage_path: string | null;
  sort_order: number;
  is_primary: boolean;
}

interface NewPhoto {
  file: File;
  previewUrl: string;
}

export default function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [featureInput, setFeatureInput] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

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

  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<ExistingImage[]>([]);
  const [newPhotos, setNewPhotos] = useState<NewPhoto[]>([]);

  useEffect(() => {
    async function fetchListing() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      setUserId(user.id);

      const { data, error: fetchError } = await supabase
        .from("listings")
        .select("*, listing_images(*)")
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

      const sortedImages = [...(data.listing_images ?? [])].sort(
        (a: ExistingImage, b: ExistingImage) => a.sort_order - b.sort_order
      );
      setExistingImages(sortedImages);
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

  const totalPhotoCount = existingImages.length + newPhotos.length;

  const handleFilesSelected = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const remaining = MAX_PHOTOS - totalPhotoCount;
      const added: NewPhoto[] = [];

      for (let i = 0; i < Math.min(files.length, remaining); i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) continue;
        if (file.size > MAX_FILE_SIZE) {
          setError(`File "${file.name}" exceeds 10MB limit`);
          continue;
        }
        added.push({
          file,
          previewUrl: URL.createObjectURL(file),
        });
      }

      if (files.length > remaining) {
        setError(
          `Maximum ${MAX_PHOTOS} photos allowed. Only first ${remaining} were added.`
        );
      }

      setNewPhotos((prev) => [...prev, ...added]);
    },
    [totalPhotoCount]
  );

  const removeExistingImage = (image: ExistingImage) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== image.id));
    setImagesToRemove((prev) => [...prev, image]);
  };

  const removeNewPhoto = (index: number) => {
    setNewPhotos((prev) => {
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

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Update listing fields
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
        throw new Error(updateError.message);
      }

      // Delete removed images from Storage and DB
      if (imagesToRemove.length > 0) {
        // Delete from storage
        const pathsToDelete = imagesToRemove
          .map((img) => img.storage_path)
          .filter((p): p is string => p !== null);

        if (pathsToDelete.length > 0) {
          await supabase.storage.from("listing-photos").remove(pathsToDelete);
        }

        // Delete from DB
        const idsToDelete = imagesToRemove.map((img) => img.id);
        await supabase
          .from("listing_images")
          .delete()
          .in("id", idsToDelete);
      }

      // Upload new photos
      if (newPhotos.length > 0 && userId) {
        const imageRecords: {
          listing_id: string;
          url: string;
          storage_path: string;
          sort_order: number;
          is_primary: boolean;
        }[] = [];

        const startOrder = existingImages.length;

        for (let i = 0; i < newPhotos.length; i++) {
          const photo = newPhotos[i];
          const ext = photo.file.name.split(".").pop() ?? "jpg";
          const fileName = `${Date.now()}-${i}.${ext}`;
          const storagePath = `${userId}/${id}/${fileName}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("listing-photos")
            .upload(storagePath, photo.file, {
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) {
            throw new Error(
              `Failed to upload photo ${i + 1}: ${uploadError.message}`
            );
          }

          const {
            data: { publicUrl },
          } = supabase.storage
            .from("listing-photos")
            .getPublicUrl(uploadData.path);

          imageRecords.push({
            listing_id: id,
            url: publicUrl,
            storage_path: storagePath,
            sort_order: startOrder + i,
            is_primary: existingImages.length === 0 && i === 0,
          });

          setUploadProgress(
            Math.round(((i + 1) / newPhotos.length) * 100)
          );
        }

        const { error: imagesError } = await supabase
          .from("listing_images")
          .insert(imageRecords);

        if (imagesError) {
          throw new Error(
            `Failed to save image records: ${imagesError.message}`
          );
        }
      }

      router.push("/dashboard/listings");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setSaving(false);
    }
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

      {/* Photos */}
      <section className="rounded-xl bg-white p-6 ring-1 ring-stone-200">
        <h3 className="font-heading text-lg font-semibold text-stone-900">
          Photos
        </h3>
        <p className="mt-1 text-sm text-stone-500">
          Manage photos for your listing (max {MAX_PHOTOS})
        </p>

        {/* Existing + new photo previews */}
        {(existingImages.length > 0 || newPhotos.length > 0) && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {existingImages.map((image, index) => (
              <div
                key={image.id}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-100"
              >
                <Image
                  src={image.url}
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
                  onClick={() => removeExistingImage(image)}
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
            {newPhotos.map((photo, index) => (
              <div
                key={photo.previewUrl}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-100 ring-2 ring-amber-300"
              >
                <Image
                  src={photo.previewUrl}
                  alt={`New photo ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <span className="absolute left-1.5 top-1.5 rounded bg-green-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  New
                </span>
                <button
                  type="button"
                  onClick={() => removeNewPhoto(index)}
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload zone */}
        {totalPhotoCount < MAX_PHOTOS && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="mt-4 flex items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 px-6 py-10 transition-colors hover:border-amber-400 hover:bg-amber-50/30"
          >
            <div className="text-center">
              <Upload className="mx-auto size-7 text-stone-400" />
              <p className="mt-2 text-sm font-medium text-stone-700">
                Add more photos
              </p>
              <p className="mt-1 text-xs text-stone-400">
                PNG, JPG up to 10MB each ({totalPhotoCount}/{MAX_PHOTOS})
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  handleFilesSelected(e.target.files);
                  e.target.value = "";
                }}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-200"
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
      {saving && newPhotos.length > 0 && uploadProgress < 100 && (
        <div className="rounded-lg bg-amber-50 px-4 py-3">
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-medium text-amber-800">
              Uploading photos...
            </span>
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
