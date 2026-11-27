/* ============================================================
   URL search-param helpers — keep server pages and filter links
   working from the same small, predictable vocabulary.
   ============================================================ */

export type AnySearchParams = Record<string, string | string[] | undefined>;

export function readParam(params: AnySearchParams, key: string): string {
  const value = params[key];
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export function readPage(params: AnySearchParams): number {
  const page = Number.parseInt(readParam(params, "page"), 10);
  return Number.isFinite(page) && page > 0 ? Math.min(page, 500) : 1;
}

export function readYear(params: AnySearchParams): string {
  const year = readParam(params, "year");
  if (!/^\d{4}$/.test(year)) return "";
  const value = Number(year);
  return value >= 1870 && value <= 2100 ? year : "";
}

const RUNTIME_RANGES: Record<string, { gte?: string; lte?: string }> = {
  short: { lte: "89" },
  medium: { gte: "90", lte: "120" },
  long: { gte: "121" },
};

export function runtimeRange(value: string): { gte: string; lte: string } {
  const range = RUNTIME_RANGES[value] ?? {};
  return { gte: range.gte ?? "", lte: range.lte ?? "" };
}

export function runtimeValue(gte: string, lte: string): string {
  if (lte === "89") return "short";
  if (gte === "90") return "medium";
  if (gte === "121") return "long";
  return "";
}

/** Copies the current params, applies overrides, and drops empty values. */
export function withParams(
  current: URLSearchParams,
  overrides: Record<string, string | undefined>,
  { resetPage = false }: { resetPage?: boolean } = {},
): URLSearchParams {
  const next = new URLSearchParams(current.toString());
  if (resetPage) next.delete("page");
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined || value === "") next.delete(key);
    else next.set(key, value);
  }
  return next;
}

export function hrefWithParams(pathname: string, params: URLSearchParams): string {
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
