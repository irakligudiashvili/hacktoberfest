// src/routes/RouteGuards.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth";

/** Protects private routes (dashboard/results/action). */
export function RequireAuth() {
  const authed = isAuthenticated();
  const location = useLocation();
  return authed ? (
    <Outlet />
  ) : (
    <Navigate to="/auth" replace state={{ from: location }} />
  );
}

/** Blocks /auth if already logged in. */
export function RedirectIfAuth() {
  const authed = isAuthenticated();
  const location = useLocation();
  return authed ? (
    <Navigate
      to={(location.state as any)?.from?.pathname || "/dashboard"}
      replace
    />
  ) : (
    <Outlet />
  );
}
