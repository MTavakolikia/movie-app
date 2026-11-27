"use client";

import { useState } from "react";
import Image from "next/image";
import { LuExpand, LuImage } from "react-icons/lu";
import type { GalleryImage } from "@/types/tmdb";
import { tmdbImage } from "@/lib/utils";
import Modal from "@/components/ui/Modal";

interface GalleryModalProps {
  images: GalleryImage[];
  title: string;
}

/** A quiet preview strip that opens into a full stills gallery. */
export default function GalleryModal({ images, title }: GalleryModalProps) {
  const [open, setOpen] = useState(false);

  if (images.length === 0) return null;

  const preview = images.slice(0, 4);

  return (
    <section aria-labelledby="stills-heading" className="mt-14">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Frame by frame</p>
          <h2 id="stills-heading" className="font-display text-2xl text-ink sm:text-3xl">
            Stills from the production
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-line-strong px-4 text-xs font-semibold text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
        >
          <LuExpand className="size-3.5" aria-hidden />
          All {images.length} stills
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {preview.map((image, index) => {
          const source = tmdbImage(image.filePath, "w780");
          if (!source) return null;
          return (
            <button
              key={image.filePath}
              type="button"
              onClick={() => setOpen(true)}
              aria-label={`Open stills gallery for ${title}`}
              className="group relative aspect-video cursor-pointer overflow-hidden rounded-xl bg-surface-2 ring-1 ring-white/[0.06] transition-[ring-color,scale] duration-500 ease-cinematic hover:ring-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Image
                src={source}
                alt={`${title} still ${index + 1}`}
                fill
                sizes="(max-width: 640px) 46vw, 22vw"
                className="object-cover transition-transform duration-700 ease-cinematic group-hover:scale-105"
              />
              <span aria-hidden className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <LuImage className="absolute right-2.5 bottom-2.5 size-4 text-white/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
            </button>
          );
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} label={`Stills from ${title}`} panelClassName="max-w-6xl">
        <div className="p-5 sm:p-7">
          <p className="eyebrow mb-2">The gallery</p>
          <h2 className="mb-6 font-display text-2xl text-ink sm:text-3xl">{title}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {images.map((image, index) => {
              const source = tmdbImage(image.filePath, "w1280");
              if (!source) return null;
              return (
                <div key={`${image.filePath}-full`} className="relative aspect-video overflow-hidden rounded-xl bg-surface-2">
                  <Image
                    src={source}
                    alt={`${title} still ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 90vw, 45vw"
                    className="object-cover"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </section>
  );
}
