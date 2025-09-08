import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS } from "@/data/products";

function applySearch(data: typeof PRODUCTS, q: string | null) {
  if (!q) return data;
  const s = q.toLowerCase();
  return data.filter(
    (p) =>
      p.name.toLowerCase().includes(s) ||
      p.sku.toLowerCase().includes(s)
  );
}

function applySort(data: typeof PRODUCTS, sort: string | null) {
  if (!sort) return [...data].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  const fields = sort.split(",").map((f) => f.trim()).filter(Boolean);
  return [...data].sort((a, b) => {
    for (const f of fields) {
      const desc = f.startsWith("-");
      const key = (desc ? f.slice(1) : f) as keyof typeof a;
      let av = a[key] as any;
      let bv = b[key] as any;
      // handle dates
      if (key === "created_at" || key === "updated_at") {
        av = Date.parse(String(av));
        bv = Date.parse(String(bv));
      }
      if (av < bv) return desc ? 1 : -1;
      if (av > bv) return desc ? -1 : 1;
    }
    return 0;
  });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "10", 10)));
  const search = url.searchParams.get("search");
  const sort = url.searchParams.get("sort");

  const filtered = applySearch(PRODUCTS, search);
  const sorted = applySort(filtered, sort);
  const total = sorted.length;
  const start = (page - 1) * limit;
  const data = sorted.slice(start, start + limit);

  return NextResponse.json({ data, total, page, limit });
}
