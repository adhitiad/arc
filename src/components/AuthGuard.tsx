"use client";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { apiKey } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!apiKey) {
      router.push("/login");
    }
  }, [apiKey, router]);

  if (!apiKey) return null; // Atau loading spinner
  return <>{children}</>;
}
