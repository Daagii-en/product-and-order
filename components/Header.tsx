"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { parseJwt, JwtUser } from "@/lib/jwt";

export default function Header() {
  const [user, setUser] = useState<JwtUser | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setUser(parseJwt(token));
  }, []);

  const initials = (user?.email || user?.sub || "?")
    .split("@")[0]
    .split(/[.\-_]/)
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0]?.toUpperCase())
    .join("") || "?";

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Left: brand + nav */}
        <div className="flex items-center gap-4">
          <Link href="/products" className="rounded-xl bg-blue-600/10 px-2.5 py-1.5 text-sm font-bold text-blue-700">
            MiniShop
          </Link>
          <nav className="hidden sm:flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Link href="/products" className="rounded-xl px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
              Products
            </Link>
            <Link href="/orders" className="rounded-xl px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
              Orders
            </Link>
          </nav>
        </div>

        {/* Right: user */}
        <div className="relative">
          {user ? (
            <button
              onClick={() => setOpen(o => !o)}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2.5 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-800/70"
            >
              <span className="grid size-7 place-items-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-white">
                {initials}
              </span>
              <span className="hidden sm:block max-w-[160px] truncate text-slate-700 dark:text-slate-100">
                {user.email ?? user.sub}
              </span>
              <svg width="16" height="16" viewBox="0 0 20 20" className="text-slate-500">
                <path fill="currentColor" d="M5.5 7.5L10 12l4.5-4.5h-9z" />
              </svg>
            </button>
          ) : (
            <Link href="/" className="btn btn-primary">Sign in</Link>
          )}

          {open && (
            <div
              className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800"
              onMouseLeave={() => setOpen(false)}
            >
              <div className="px-3 py-2 text-xs text-slate-500">Signed in as</div>
              <div className="px-3 pb-2 text-sm font-medium text-slate-800 dark:text-slate-100">
                {user?.email ?? user?.sub}
              </div>
              <div className="my-2 border-t border-slate-200 dark:border-slate-700" />
              <Link
                href="/products"
                className="block px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                Products
              </Link>
              <Link
                href="/orders"
                className="block px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                Orders
              </Link>
              <div className="my-2 border-t border-slate-200 dark:border-slate-700" />
              <button
                onClick={logout}
                className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
