"use client";

import { useState } from "react";
import Image from "next/image";

export function PhotoGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-stone-100">
        <Image
          src={images[activeIndex]}
          alt={`${alt} - Photo ${activeIndex + 1}`}
          fill
          unoptimized
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((src, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg transition-all ${
                index === activeIndex
                  ? "ring-2 ring-stone-900 ring-offset-2"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt={`${alt} - Thumbnail ${index + 1}`}
                fill
                unoptimized
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
