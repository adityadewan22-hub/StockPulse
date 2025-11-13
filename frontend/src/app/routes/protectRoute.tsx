"use client";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "../context/authContext";
import { usePathname, useRouter } from "next/navigation";

function ProtectRoute({ children }: { children: ReactNode }) {
  const { token, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!token) {
      localStorage.setItem("redirectLogin", pathname);
      router.push("/login");
    }
  }, [token, router, pathname, loading]);
  if (!token) {
    return null;
  }

  if (loading || !token) {
    return <div>Loading...</div>;
  }
  return <>{children}</>;
}

export default ProtectRoute;
