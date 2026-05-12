"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface PhotoGalleryProps {
  images: string[];
  alt: string;
}

export function PhotoGallery({ images, alt }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const total = images.length;

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + total) % total);
    },
    [total]
  );

  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goTo(activeIndex - 1);
      if (e.key === "ArrowRight") goTo(activeIndex + 1);
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, activeIndex, goTo]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (!thumbnailsRef.current) return;
    const active = thumbnailsRef.current.children[activeIndex] as HTMLElement;
    if (active) {
      active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeIndex]);

  // Touch swipe handlers
  const minSwipeDistance = 50;
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) >= minSwipeDistance) {
      if (distance > 0) next();
      else prev();
    }
  };

  return (
    <>
      {/* Main Image */}
      <div className="space-y-3">
        <div
          className="group relative aspect-[16/10] cursor-pointer overflow-hidden rounded-2xl bg-stone-100"
          onClick={() => setLightboxOpen(true)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={images[activeIndex]}
            alt={`${alt} - Photo ${activeIndex + 1}`}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />

          {/* Photo count badge */}
          <div className="absolute bottom-3 right-3 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            {activeIndex + 1} / {total}
          </div>

          {/* Hover overlay hint */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/10">
            <span className="rounded-lg bg-black/60 px-4 py-2 text-sm font-medium text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
              Click to enlarge
            </span>
          </div>

          {/* Navigation arrows (desktop) */}
          {total > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 text-stone-700 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 md:flex"
                aria-label="Previous photo"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 text-stone-700 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 md:flex"
                aria-label="Next photo"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}
        </div>

        {/* Mobile dots indicator */}
        {total > 1 && (
          <div className="flex justify-center gap-1.5 md:hidden">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`size-2 rounded-full transition-all ${
                  index === activeIndex
                    ? "w-6 bg-stone-900"
                    : "bg-stone-300"
                }`}
                aria-label={`Go to photo ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Thumbnails row (desktop) */}
        {total > 1 && (
          <div
            ref={thumbnailsRef}
            className="hidden gap-2 overflow-x-auto pb-1 md:flex"
          >
            {images.map((src, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`relative h-[72px] w-[108px] flex-shrink-0 overflow-hidden rounded-xl transition-all ${
                  index === activeIndex
                    ? "ring-2 ring-stone-900 ring-offset-2"
                    : "opacity-50 hover:opacity-100"
                }`}
              >
                <Image
                  src={src}
                  alt={`${alt} - Thumbnail ${index + 1}`}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="108px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label="Close lightbox"
          >
            <X className="size-6" />
          </button>

          {/* Counter */}
          <div className="absolute left-4 top-4 z-10 text-sm font-medium text-white/80">
            {activeIndex + 1} / {total}
          </div>

          {/* Image */}
          <div
            className="relative h-[80vh] w-[90vw] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeIndex]}
              alt={`${alt} - Photo ${activeIndex + 1}`}
              fill
              unoptimized
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {/* Lightbox navigation */}
          {total > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                aria-label="Previous photo"
              >
                <ChevronLeft className="size-7" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                aria-label="Next photo"
              >
                <ChevronRight className="size-7" />
              </button>
            </>
          )}

          {/* Lightbox thumbnail strip */}
          {total > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-xl bg-black/50 p-2 backdrop-blur-sm">
              {images.map((src, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.stopPropagation(); setActiveIndex(index); }}
                  className={`relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg transition-all ${
                    index === activeIndex
                      ? "ring-2 ring-white"
                      : "opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
