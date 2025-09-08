"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { API_BASE, authHeadersExport } from "@/lib/api";

type OrderItem = { id: string; product_id: string; qty: number; unit_price: number };
type Order = { id: string; order_no: string; status: "NEW" | "PAID" | "CANCELLED"; total_amount: number; items?: OrderItem[] };

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<"pay" | "cancel" | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch(`${API_BASE}/api/orders/${id}`, { headers: { ...authHeadersExport() } });
      if (!r.ok) throw new Error("Failed to load");
      const res = await r.json();
      setOrder(res.data);
    } catch (e: any) {
      setErr(e.message ?? "Load error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (id) load(); }, [id]);

  async function pay() {
    if (!order) return;
    setWorking("pay");
    setErr(null);
    try {
      const r = await fetch(`${API_BASE}/api/orders/${order.id}/pay`, { method: "POST", headers: { ...authHeadersExport() } });
      if (!r.ok) throw new Error(await r.text());
      await load();
    } catch (e: any) {
      setErr(e.message ?? "Pay failed");
    } finally {
      setWorking(null);
    }
  }

  async function cancel() {
    if (!order) return;
    setWorking("cancel");
    setErr(null);
    try {
      const r = await fetch(`${API_BASE}/api/orders/${order.id}/cancel`, { method: "POST", headers: { ...authHeadersExport() } });
      if (!r.ok) throw new Error(await r.text());
      await load();
    } catch (e: any) {
      setErr(e.message ?? "Cancel failed");
    } finally {
      setWorking(null);
    }
  }

  if (loading) return <p className="p-6 text-slate-500">Loading…</p>;
  if (!order) return <p className="p-6 text-red-600">Not found</p>;

  return (
    <main className="min-h-dvh bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Order {order.order_no}
          </h1>
          <Link href="/orders" className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
            ← Back
          </Link>
        </div>

        {err && (
          <div className="mb-3 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30">{err}</div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_320px]">
          {/* Items */}
          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-2 text-sm text-slate-600 dark:text-slate-300">
              Status: <b>{order.status}</b> • Total: <b>{order.total_amount}</b>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="text-left text-slate-600">
                  <tr className="border-b border-slate-200/70 dark:border-slate-800">
                    <th className="py-2 pr-3">Product ID</th>
                    <th className="py-2 pr-3">Qty</th>
                    <th className="py-2 pr-3">Unit Price</th>
                    <th className="py-2 pr-3">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="text-slate-800 dark:text-slate-200">
                  {order.items?.map((it) => (
                    <tr key={it.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                      <td className="py-3 pr-3 font-mono text-xs">{it.product_id}</td>
                      <td className="py-3 pr-3">{it.qty}</td>
                      <td className="py-3 pr-3">{it.unit_price}</td>
                      <td className="py-3 pr-3">{it.unit_price * it.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Actions */}
          <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Actions</h3>
            <div className="grid gap-2">
              <button
                onClick={pay}
                disabled={order.status !== "NEW" || working !== null}
                className="btn btn-primary"
              >
                {working === "pay" ? "Paying…" : "Pay"}
              </button>
              <button
                onClick={cancel}
                disabled={order.status === "CANCELLED" || working !== null}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-800/70"
              >
                {working === "cancel" ? "Cancelling…" : "Cancel"}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
