"use client";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";

function ProtectRoute({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);
  if (!token) {
    return null;
  }

  if (loading || !token) {
    return <div>Loading...</div>;
  }
  return <>{children}</>;
}

export default ProtectRoute;
