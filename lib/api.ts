// web/lib/api.ts
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";

export async function login(email: string, password: string) {
  const r = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({email, password})
  });
  if (!r.ok) throw new Error("Login failed");
  const {token} = await r.json();
  localStorage.setItem("token", token);
}

function authHeaders() {
  const t = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function getProducts(params: {page?:number;limit?:number;search?:string;sort?:string} = {}) {
  const t = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  if (params.search) q.set("search", params.search);
  if (params.sort) q.set("sort", params.sort);
  const r = await fetch(`${API_BASE}/api/products?${q}`, { headers: {Authorization: `Bearer ${t}`} });
  if (!r.ok) throw new Error("Failed");
  return r.json();
}

export async function upsertProduct(p: any, id?: string) {
  const t = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const url = id ? `${API_BASE}/api/products/${id}` : `${API_BASE}/api/products`;
  const method = id ? "PUT" : "POST";
  const r = await fetch(url, { method, headers: { "Content-Type":"application/json", "Authorization": `Bearer ${t}` }, body: JSON.stringify(p)});
  if (!r.ok) throw new Error("Failed to save");
  return r.json();
}

export async function deleteProduct(id: string) {
  const t = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const r = await fetch(`${API_BASE}/api/products/${id}`, { method:"DELETE", headers: {"Authorization": `Bearer ${t}`} });
  if (!r.ok) throw new Error("Delete failed");
}

export async function getOrders() {
  const t = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const r = await fetch(`${API_BASE}/api/orders`, { headers: {"Authorization": `Bearer ${t}`} });
  if (!r.ok) throw new Error("Failed");
  return r.json();
}

export async function createOrder(items: {product_id: string; qty: number}[]) {
  const t = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const r = await fetch(`${API_BASE}/api/orders`, { method:"POST", headers: {"Content-Type":"application/json", "Authorization": `Bearer ${t}`}, body: JSON.stringify({items}) });
  if (!r.ok) throw new Error("Create failed");
  return r.json();
}

export async function getOrder(id: string) {
  const t = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const r = await fetch(`${API_BASE}/api/orders/${id}`, { headers: {"Authorization": `Bearer ${t}` }});
  if (!r.ok) throw new Error("Failed");
  return r.json();
}

export async function payOrder(id: string) {
  const t = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const r = await fetch(`${API_BASE}/api/orders/${id}/pay`, { method:"POST", headers: {"Authorization": `Bearer ${t}`} });
  if (!r.ok) throw new Error("Pay failed");
  return r.json();
}

export async function cancelOrder(id: string) {
  const t = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const r = await fetch(`${API_BASE}/api/orders/${id}/cancel`, { method:"POST", headers: {"Authorization": `Bearer ${t}`}});
  if (!r.ok) throw new Error("Cancel failed");
  return r.json();
}


export function authHeadersExport(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}
