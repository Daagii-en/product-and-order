export type JwtUser = { sub?: string; email?: string };

export function parseJwt(token: string | null): JwtUser | null {
  if (!token) return null;
  try {
    const [, payload] = token.split(".");
    const json = JSON.parse(Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
    return { sub: json.sub, email: json.email };
  } catch {
    return null;
  }
}
