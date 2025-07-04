export const expirationTime = "5m";
export const refreshExpirationTime = "40m";

// Secret keys (could load from env): shorter for example only
export const ACCESS_SECRET_KEY = new TextEncoder().encode(Deno.env.get("JWT_ACCESS_SECRET") || "ACCESS_SECRET_KEY");
export const REFRESH_SECRET_KEY = new TextEncoder().encode(Deno.env.get("JWT_REFRESH_SECRET") || "REFRESH_SECRET_KEY");
