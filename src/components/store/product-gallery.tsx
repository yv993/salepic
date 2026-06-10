"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : ["/postcards/postal-nostalgia.svg"];
  const current = list[Math.min(active, list.length - 1)];

  return (
    <div className="flex flex-col gap-4">
      <div className="surface grain relative aspect-[1.41/1] overflow-hidden rounded-2xl p-2">
        <div className="relative size-full overflow-hidden rounded-xl">
          <Image
            src={current}
            alt={title}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      {list.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {list.map((src, i) => (
            <button
              key={src + i}
              type="button"
              aria-label={`View image ${i + 1}`}
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-[1.41/1] w-24 overflow-hidden rounded-lg ring-1 transition-all",
                i === active
                  ? "ring-2 ring-primary"
                  : "ring-border hover:ring-foreground/30",
              )}
            >
              <Image
                src={src}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
