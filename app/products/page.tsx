"use client";

import { useEffect, useMemo, useState } from "react";
import { PRODUCTS } from "@/data/products";
// --- Helpers ----------------------------------------------------
// const API_BASE =
//   process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";

// локал API route ашиглана
const API_BASE = ""; // Next.js app router → fetch("/api/products")

function authHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  created_at?: string;
  updated_at?: string;
};

type ListResponse = {
  data: Product[];
  total: number;
  page: number;
  limit: number;
};

// --- Page -------------------------------------------------------
export default function ProductsPage() {
  // table state
  const [items, setItems] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("price,-created_at");

  // ui state
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // form state (create/update)
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<{
    name: string;
    sku: string;
    price: number;
    stock: number;
  }>({
    name: "",
    sku: "",
    price: 0,
    stock: 0,
  });
  const isEdit = !!editing?.id;

  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit]
  );

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const q = new URLSearchParams();
      q.set("page", String(page));
      q.set("limit", String(limit));
      if (search) q.set("search", search);
      if (sort) q.set("sort", sort);

      const r = await fetch(`${API_BASE}/api/products?${q.toString()}`, {
        headers: { ...authHeaders() },
      });
      if (!r.ok) throw new Error("Failed to load products");
      const res: ListResponse = await r.json();
      console.log("Data check: ", res.data);
      // res.data = PRODUCTS;
      setItems(res.data);
      setTotal(res.total ?? 0);
    } catch (e: any) {
      setErr(e.message ?? "Load error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, sort]); // search-д debounce хэрэгжүүлнэ

  // simple debounce for search
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      load();
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // --- CRUD -----------------------------------------------------
  function openCreate() {
    setEditing(null);
    setForm({ name: "", sku: "", price: 0, stock: 0 });
  }
  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      name: p.name,
      sku: p.sku,
      price: p.price,
      stock: p.stock,
    });
  }

  function validateForm() {
    if (!form.name.trim()) return "Name is required";
    if (!form.sku.trim()) return "SKU is required";
    if (form.price < 0) return "Price must be ≥ 0";
    if (form.stock < 0) return "Stock must be ≥ 0";
    return null;
  }

  async function save() {
    const v = validateForm();
    if (v) {
      setErr(v);
      return;
    }
    setErr(null);
    const url = isEdit
      ? `${API_BASE}/api/products/${editing!.id}`
      : `${API_BASE}/api/products`;
    const method = isEdit ? "PUT" : "POST";
    const r = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(form),
    });
    if (!r.ok) {
      const text = await r.text();
      setErr(text || "Failed to save");
      return;
    }
    await load();
    setEditing(null);
    setForm({ name: "", sku: "", price: 0, stock: 0 });
  }

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    const r = await fetch(`${API_BASE}/api/products/${id}`, {
      method: "DELETE",
      headers: { ...authHeaders() },
    });
    if (!r.ok) {
      setErr("Delete failed");
      return;
    }
    // current page may become empty → back one page
    const nextCount = items.length - 1;
    if (nextCount === 0 && page > 1) setPage(page - 1);
    else load();
  }

  return (
    <main className="min-h-dvh bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-6">
        <header className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Products
            </h1>
            {/* <p className="text-sm text-slate-500">List • Search • Create • Edit • Paginate</p> */}
          </div>
          {/* <button
            onClick={openCreate}
            className="btn btn-primary"
          >
            + New Product
          </button> */}
        </header>

        {/* Search & Sort */}
        <section className="mb-4   gap-3 sm:flex">
          <input
            className="input border-b-1 focus:ring-0 focus:outline-none"
            placeholder="Search by name or SKU…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="input focus:ring-0 focus:outline-none border-b-1 rounded w-fit"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="price,-created_at">Price ↑, Newest</option>
            <option value="-price">Price ↓</option>
            <option value="created_at">Created ↑</option>
            <option value="-created_at">Created ↓</option>
            <option value="name">Name A→Z</option>
            <option value="-name">Name Z→A</option>
          </select>
          <select
            className="input w-fit rounded border-b-1  focus:ring-0 focus:outline-none"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value="5">5 / page</option>
            <option value="10">10 / page</option>
            <option value="20">20 / page</option>
            <option value="50">50 / page</option>
          </select>
        </section>

        {/* Card */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_380px]">
          {/* Table */}
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {loading ? (
              <p className="text-slate-500">Loading…</p>
            ) : items.length === 0 ? (
              <div className="grid place-items-center py-12">
                <p className="text-slate-500">No products found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead className="text-left text-slate-600">
                    <tr className="border-b border-slate-200/70 dark:border-slate-800">
                      <th className="py-2 pr-3">Name</th>
                      <th className="py-2 pr-3">SKU</th>
                      <th className="py-2 pr-3">Price</th>
                      <th className="py-2 pr-3">Stock</th>
                      <th className="py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-800 dark:text-slate-200">
                    {items.map((p) => (
                      <tr
                        key={p.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/40"
                      >
                        <td className="py-3 pr-3 font-medium">{p.name}</td>
                        <td className="py-3 pr-3">{p.sku}</td>
                        <td className="py-3 pr-3">{p.price}</td>
                        <td className="py-3 pr-3">{p.stock}</td>
                        <td className="py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEdit(p)}
                              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => remove(p.id)}
                              className="rounded-xl border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-800/50 dark:hover:bg-red-900/30"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
              <p className="text-xs text-slate-500">
                Showing {(items.length && (page - 1) * limit + 1) || 0}–
                {(page - 1) * limit + items.length} of {total}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-50 dark:border-slate-700"
                >
                  Prev
                </button>
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {page} / {pageCount}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={page >= pageCount}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-50 dark:border-slate-700"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Create / Edit form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
              {isEdit ? "Edit product" : "Add product"}
            </h3>

            {err && (
              <div className="mb-3 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30">
                {err}
              </div>
            )}

            <div className="grid gap-3">
              <div>
                <label className="label" htmlFor="name">
                  Name:
                </label>
                <input
                  id="name"
                  className="input ml-2"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="T-Shirt"
                />
              </div>

              <div>
                <label className="label" htmlFor="sku">
                  SKU:
                </label>
                <input
                  id="sku"
                  className="input ml-2"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  placeholder="SKU-TS-001"
                />
              </div>
              <div>
                <label className="label" htmlFor="price">
                  Price:
                </label>
                <input
                  id="price"
                  type="number"
                  min={0}
                  className="input focus:ring-0 focus:outline-none ml-3"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: Number(e.target.value) })
                  }
                />
              </div>

              <div>
                <label className="label" htmlFor="stock">
                  Stock:
                </label>
                <input
                  id="stock"
                  type="number"
                  min={0}
                  className="input focus:ring-0 focus:outline-none ml-3"
                  value={form.stock}
                  onChange={(e) =>
                    setForm({ ...form, stock: Number(e.target.value) })
                  }
                />
              </div>

              <div className="mt-2 flex gap-2">
                <button
                  onClick={save}
                  className="btn btn-primary flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-blue-50 dark:border-slate-700 dark:hover:bg-blue-600"
                >
                  {isEdit ? "Save changes" : "Create"}
                </button>
                {isEdit && (
                  <button
                    onClick={() => {
                      setEditing(null);
                      setForm({ name: "", sku: "", price: 0, stock: 0 });
                      setErr(null);
                    }}
                    className="btn flex-1 rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-800/70"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {isEdit && (
              <p className="mt-3 text-xs text-slate-500">
                Editing: <span className="font-medium">{editing?.name}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
