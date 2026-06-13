import { Navigate, Outlet, useLocation } from "react-router-dom";

interface Props {
  isAuthenticated: boolean;
  redirectTo?: string;
}



export function ProtectedRoute({ isAuthenticated, redirectTo = "/login" }: Props) {
  const location = useLocation()
  if (!isAuthenticated) {
    // return <Navigate to={redirectTo} replace />;
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <Outlet />;
}