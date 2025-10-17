"use client";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";

function ProtectRoute({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);
  if (!token) {
    return null;
  }

  return <>{children}</>;
}

export default ProtectRoute;
