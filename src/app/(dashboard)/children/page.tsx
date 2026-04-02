"use client"

import Link from "next/link";
import { Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { ChildCard } from "@/components/child-card";
import { useChildren } from "@/lib/api/hooks";
import { cn } from "@/lib/utils";

export default function ChildrenPage() {
  const childrenQ = useChildren();

  const loading = childrenQ.isPending;
  const children = childrenQ.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="clinical-page-title">Children</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Profiles, diagnoses, and goal readiness snapshots.
          </p>
        </div>
        <Link
          href="/goals"
          className={cn(
            buttonVariants({ variant: "outline", size: "default" }),
            "gap-2"
          )}
        >
            <Plus className="size-4" aria-hidden />
            Add goal
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Clinic roster</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border/60 bg-background/40 p-4">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="mt-2 h-3 w-24" />
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : children.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {children.map((c) => (
                <ChildCard key={c.id} child={c} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Plus}
              title="No children yet"
              description="Once your clinic roster is added, you can create OT goals and log sessions."
              action={
                <Link
                  href="/goals"
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "default" }),
                    "mt-2"
                  )}
                >
                  Create first goal
                </Link>
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

