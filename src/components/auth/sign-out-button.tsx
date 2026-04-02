"use client"

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={pending}
      className="w-full justify-start gap-2"
      onClick={async () => {
        setPending(true);
        window.localStorage.removeItem("demo_auth");
        router.push("/login");
      }}
    >
      <LogOut className="size-4" aria-hidden />
      {pending ? "Signing out…" : "Sign out (demo)"}
    </Button>
  );
}

