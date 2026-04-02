"use client"

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Navigation } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useChildren } from "@/lib/api/hooks";
import type { Child } from "@/types";

function childIdFromPathname(pathname: string) {
  if (!pathname.startsWith("/children/")) return null;
  const parts = pathname.split("/");
  return parts[2] ?? null;
}

export function ChildrenPicker() {
  const router = useRouter();
  const pathname = usePathname();

  const childrenQ = useChildren();
  const children = childrenQ.data ?? [];

  const childIdFromPath = useMemo(
    () => childIdFromPathname(pathname),
    [pathname]
  );

  const selectedId = childIdFromPath ?? children[0]?.id ?? "";

  if (childrenQ.isPending) {
    return (
      <div className="flex w-full items-center gap-2">
        <Navigation className="size-4 text-muted-foreground" aria-hidden />
        <Skeleton className="h-9 w-52" />
      </div>
    );
  }

  if (!children.length) return null;

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedId || undefined}
        onValueChange={(v) => {
          if (!v) return;
          router.push(`/children/${v}`);
        }}
      >
        <SelectTrigger className={cn("w-full min-w-[220px] md:w-64", "h-9")}>
          <div className="flex items-center gap-2">
            <Navigation className="size-4 text-muted-foreground" aria-hidden />
            <SelectValue placeholder="Select child" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {children.map((c: Child) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

