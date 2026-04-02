"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [status] = useState<"unknown" | "authed" | "unauth">(
    () => {
      if (typeof window === "undefined") return "unknown";
      const token = window.localStorage.getItem("demo_auth");
      return token ? "authed" : "unauth";
    }
  );

  useEffect(() => {
    if (status !== "unauth") return;
    router.replace("/login");
  }, [router, status]);

  if (status === "unknown") {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-8">
        <Skeleton className="h-10 w-56" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (status === "unauth") return null;

  return <>{children}</>;
}

