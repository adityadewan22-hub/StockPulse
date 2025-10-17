import type { ReactNode } from "react";
import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";

function ProtectRoute({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectRoute;
