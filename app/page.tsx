"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@demo.dev");
  const [password, setPassword] = useState("admin123");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!email || !password) { setErr("Please enter email and password."); return; }

    try {
      setLoading(true);
      //const base = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";
      // const res = await fetch(`${base}/auth/login`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }),
      // });
      // if (!res.ok) throw new Error("Invalid credentials");
      // const { token } = await res.json();
      // localStorage.setItem("token", token);

      // after successful login:
      window.location.href = "/products";
    } catch (e: any) {
      setErr(e.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-dvh bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <div className="container flex min-h-dvh items-center justify-center">
        <div className="grid w-full max-w-md gap-6 p-4 sm:p-0">
          {/* Brand */}
          <div className="mx-auto text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-blue-600/10 grid place-items-center">
              <span className="text-xl font-black text-blue-700">Λ</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Sign in to your account
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Use your demo account or admin credentials.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur shadow-lg dark:border-slate-800 dark:bg-slate-900/60">
            <form onSubmit={onSubmit} className="p-5 sm:p-6">
              <div className="grid gap-4">
                <div className="sm:flex sm:justify-between">
                  <label className="label" htmlFor="email">Email:</label>
                  <div className="relative  sm:ml-3 underline border-b-2">
<input
                    id="email"
                    type="email"
                    className="input focus:ring-0 focus:outline-none"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  </div>
                  
                </div>

                <div className="sm:flex  sm:justify-between">
                  <label className="label" htmlFor="password">Password:</label>
                  <div className="relative  sm:ml-3 underline border-b-2">
                    <input
                      id="password"
                      type={showPwd ? "text" : "password"}
                      className="input focus:ring-0 focus:outline-none"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((s) => !s)}
                      className="absolute inset-y-0 right-2 my-1 inline-flex items-center rounded-xl px-2 text-xs text-slate-500 hover:bg-slate-100"
                      aria-label={showPwd ? "Hide password" : "Show password"}
                    >
                      {showPwd ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    Remember me
                  </label>
                  <a className="text-sm font-medium text-blue-700 hover:underline" href="#">
                    Forgot password?
                  </a>
                </div>

                {err && (
                  <div
                    role="alert"
                    className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                  >
                    {err}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </form>
          </div>

          {/* Footer hint */}
          <p className="text-center text-xs text-slate-500">
            Test: <span className="font-medium">admin@demo.dev / admin123</span>
          </p>
        </div>
      </div>
    </main>
  );
}
