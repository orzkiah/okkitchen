"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SORT_OPTIONS } from "@/lib/constants";

interface Props {
  categories: { name: string; slug: string }[];
}

export function CatalogToolbar({ categories }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const currentQ = params.get("q") ?? "";
  const currentCategory = params.get("category") ?? "all";
  const currentSort = params.get("sort") ?? "newest";

  const [search, setSearch] = React.useState(currentQ);

  const updateParam = React.useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (!value || value === "all" || value === "") next.delete(key);
        else next.set(key, value);
      }
      next.delete("page"); // reset pagination on filter change
      router.push(`${pathname}?${next.toString()}`);
    },
    [params, pathname, router]
  );

  // Debounced search
  React.useEffect(() => {
    const t = setTimeout(() => {
      if (search !== currentQ) updateParam({ q: search });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari menu favoritmu..."
            className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-10 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Hapus pencarian"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <select
          value={currentSort}
          onChange={(e) => updateParam({ sort: e.target.value })}
          className="h-11 rounded-lg border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Urutkan"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <CategoryPill
          active={currentCategory === "all"}
          onClick={() => updateParam({ category: "all" })}
        >
          Semua
        </CategoryPill>
        {categories.map((c) => (
          <CategoryPill
            key={c.slug}
            active={currentCategory === c.slug}
            onClick={() => updateParam({ category: c.slug })}
          >
            {c.name}
          </CategoryPill>
        ))}
      </div>
    </div>
  );
}

function CategoryPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "bg-background hover:bg-secondary"
      )}
    >
      {children}
    </button>
  );
}
