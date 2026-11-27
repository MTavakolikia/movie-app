"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { LuX } from "react-icons/lu";
import { cn } from "@/lib/cn";

interface NavSearchProps {
  /** Sit on hero artwork (light-on-dark) instead of the page surface. */
  onArtwork: boolean;
}

const TRIGGER =
  "inline-flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

/**
 * Compact search in the header. On phones it is a direct link to /search;
 * from `md` up it expands into an inline field that submits to /search?q=.
 */
export default function NavSearch({ onArtwork }: NavSearchProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = query.trim();
    if (!term) {
      inputRef.current?.focus();
      return;
    }
    setOpen(false);
    setQuery("");
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const close = () => {
    setOpen(false);
  };

  return (
    <div className="relative flex items-center">
      {/* Phones: straight to the search page */}
      <Link href="/search" aria-label="Search" className={cn(TRIGGER, "md:hidden")}>
        <FiSearch className="size-[18px]" aria-hidden />
      </Link>

      {/* Tablet and up: expanding inline field */}
      <button
        type="button"
        aria-label="Search"
        aria-expanded={open}
        aria-controls={inputId}
        tabIndex={open ? -1 : 0}
        aria-hidden={open}
        onClick={() => setOpen(true)}
        className={cn(TRIGGER, "hidden md:inline-flex", open && "pointer-events-none opacity-0")}
      >
        <FiSearch className="size-[18px]" aria-hidden />
      </button>

      <form
        onSubmit={submit}
        role="search"
        aria-hidden={!open}
        className={cn(
          "absolute top-1/2 right-0 flex h-10 -translate-y-1/2 items-center overflow-hidden rounded-full border transition-[width,opacity,border-color] duration-500 ease-cinematic",
          onArtwork ? "border-white/20 bg-black/55 backdrop-blur-xl" : "border-line-strong bg-surface backdrop-blur-md",
          open ? "w-72 opacity-100" : "pointer-events-none w-10 opacity-0",
        )}
      >
        <FiSearch className="ml-4 size-4 shrink-0 text-muted" aria-hidden />
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          value={query}
          tabIndex={open ? 0 : -1}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") close();
          }}
          placeholder="Search movies & shows"
          aria-label="Search movies and TV shows"
          className="h-full w-full min-w-0 bg-transparent px-3 text-sm text-ink outline-none placeholder:text-faint [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            tabIndex={open ? 0 : -1}
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="mr-1 inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <LuX className="size-4" aria-hidden />
          </button>
        )}
        <button type="submit" className="sr-only">
          Search
        </button>
      </form>
    </div>
  );
}
