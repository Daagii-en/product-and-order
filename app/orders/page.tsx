"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE, authHeadersExport } from "@/lib/api";
import { PRODUCTS } from "@/data/products";

type Product = { id: string; name: string; sku: string; price: number; stock: number };
type Order = { id: string; order_no: string; status: "NEW" | "PAID" | "CANCELLED"; total_amount: number };

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<{ product_id: string; qty: number }[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      // products for order creation
      const pr = await fetch(`${API_BASE}/api/products?limit=100`, { headers: { ...authHeadersExport() } });
      if (!pr.ok) throw new Error("Failed to load products");
      const pjson = await pr.json();

      const or = await fetch(`${API_BASE}/api/orders`, { headers: { ...authHeadersExport() } });
      if (!or.ok) throw new Error("Failed to load orders");
      const ojson = await or.json();
      pjson.data = PRODUCTS;
      setProducts(pjson.data ?? []);
      setOrders(ojson.data ?? []);
    } catch (e: any) {
      setErr(e.message ?? "Load error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function addItem() {
    if (products.length === 0) return;
    setItems((arr) => [...arr, { product_id: products[0].id, qty: 1 }]);
  }

  async function createOrder() {
    if (items.length === 0) return;
    setSubmitting(true);
    setErr(null);
    try {
      const r = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeadersExport() },
        body: JSON.stringify({ items }),
      });
      if (!r.ok) throw new Error(await r.text());
      setItems([]);
      await load();
    } catch (e: any) {
      setErr(e.message ?? "Create failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-dvh bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-6">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Orders</h1>
            <p className="text-sm text-slate-500">Жагсаалт, захиалга үүсгэх</p>
          </div>
          <Link href="/products" className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
            ← Products
          </Link>
        </header>

        {/* Create Order */}
        <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Захиалга үүсгэх</h3>
            <button onClick={addItem} className="btn btn-primary">+ Add Item</button>
          </div>

          {items.length === 0 ? (
            <p className="text-sm text-slate-500">Бараа нэмэхийн тулд <b>+ Add Item</b> дар.</p>
          ) : (
            <div className="space-y-3">
              {items.map((it, idx) => (
                <div key={idx} className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(220px,1fr)_120px_auto]">
                  <select
                    className="input"
                    value={it.product_id}
                    onChange={(e) => {
                      const v = e.target.value;
                      setItems((arr) => arr.map((x, i) => (i === idx ? { ...x, product_id: v } : x)));
                    }}
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    className="input"
                    value={it.qty}
                    onChange={(e) =>
                      setItems((arr) => arr.map((x, i) => (i === idx ? { ...x, qty: Math.max(1, Number(e.target.value)) } : x)))
                    }
                  />
                  <button
                    onClick={() => setItems((arr) => arr.filter((_, i) => i !== idx))}
                    className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-800/50 dark:hover:bg-red-900/20"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 flex justify-end">
            <button
              onClick={createOrder}
              disabled={items.length === 0 || submitting}
              className="btn btn-primary"
            >
              {submitting ? "Creating..." : "Create Order"}
            </button>
          </div>
        </section>

        {/* Orders list */}
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Жагсаалт</h3>
          </div>

          {err && (
            <div className="mb-3 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30">{err}</div>
          )}

          {loading ? (
            <p className="text-slate-500">Loading…</p>
          ) : orders.length === 0 ? (
            <div className="grid place-items-center py-12">
              <p className="text-slate-500">Одоогоор захиалга алга</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="text-left text-slate-600">
                  <tr className="border-b border-slate-200/70 dark:border-slate-800">
                    <th className="py-2 pr-3">Order No</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2 pr-3">Total</th>
                    <th className="py-2 text-right">Detail</th>
                  </tr>
                </thead>
                <tbody className="text-slate-800 dark:text-slate-200">
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/40">
                      <td className="py-3 pr-3 font-medium">{o.order_no}</td>
                      <td className="py-3 pr-3">{o.status}</td>
                      <td className="py-3 pr-3">{o.total_amount}</td>
                      <td className="py-3">
                        <div className="flex justify-end">
                          <Link
                            href={`/orders/${o.id}`}
                            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                          >
                            Open
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
