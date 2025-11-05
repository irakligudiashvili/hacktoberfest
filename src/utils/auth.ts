export function getToken() {
  return localStorage.getItem("token");
}

function safeParseJwt(token: string | null): { exp?: number } | null {
  try {
    if (!token) return null;
    const [, payload] = token.split(".");
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;

  // Optional: expire check if token is a JWT
  const decoded = safeParseJwt(token);
  if (decoded?.exp && Date.now() / 1000 > decoded.exp) {
    // expired → clean up
    localStorage.removeItem("token");
    return false;
  }
  return true;
}
