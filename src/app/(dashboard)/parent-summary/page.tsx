"use client"

import { useMemo } from "react";
import { CalendarDays, Printer, Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { PrintGoalItem } from "@/components/goals/print-goal-item";
import { useChildren, useGoals, useSessions } from "@/lib/api/hooks";
import type { Child, Goal, Session } from "@/types";

function formatDate(dateISO: string) {
  const d = new Date(dateISO);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

export default function ParentSummaryPage() {
  const childrenQ = useChildren();
  const goalsQ = useGoals();
  const sessionsQ = useSessions();

  const loading = childrenQ.isPending || goalsQ.isPending || sessionsQ.isPending;
  const children = childrenQ.data ?? [];
  const goals = goalsQ.data ?? [];
  const sessions = sessionsQ.data ?? [];

  const lastSessionByChild = useMemo(() => {
    const map = new Map<string, Session>();
    for (const s of sessions) {
      if (!map.has(s.child_id)) map.set(s.child_id, s);
    }
    return map;
  }, [sessions]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-56" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-96 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!children.length) {
    return (
      <EmptyState
        icon={Users}
        title="No family data"
        description="Add children to your clinic roster to generate parent-friendly summaries."
      />
    );
  }

  return (
    <div className="space-y-6 print-container">
      <div>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="clinical-page-title inline-flex items-center gap-2">
              <Users className="size-5" aria-hidden />
              Family Summary
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Read-only view you can share with families to explain goal progress at a glance.
            </p>
          </div>
          <div className="no-print">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => window.print()}
            >
              <Printer className="size-4" aria-hidden />
              Print
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {children.map((child: Child, idx: number) => {
          const goalsForChild = goals.filter((g) => g.child_id === child.id);
          const last = lastSessionByChild.get(child.id) ?? null;

          return (
            <Card
              key={child.id}
              className={idx === 0 ? "" : "print-page-break"}
            >
              <CardHeader>
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-base">{child.name}</CardTitle>
                    <CardDescription>
                      Age {child.age} · {child.diagnosis.join(", ")}
                    </CardDescription>
                    <div className="flex flex-wrap gap-2">
                      {child.diagnosis.map((d) => (
                        <Badge key={d} variant="secondary" className="rounded-full">
                          {d}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {last ? (
                    <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground inline-flex items-center gap-2">
                        <CalendarDays className="size-3.5" aria-hidden />
                        Latest session
                      </p>
                      <p className="mt-1 text-sm font-semibold">{formatDate(last.date)}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {last.duration_minutes} minutes
                      </p>
                    </div>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {goalsForChild.length ? (
                    goalsForChild.map((g: Goal) => (
                      <PrintGoalItem key={g.id} goal={g} />
                    ))
                  ) : (
                    <div className="rounded-lg border border-border/60 bg-muted/10 p-4 text-sm text-muted-foreground">
                      <EmptyState
                        icon={Users}
                        title="No goals yet"
                        description="This child doesn’t have goals configured in the MVP dataset."
                        className="border-none bg-transparent"
                      />
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/10 p-4 text-sm text-muted-foreground">
                  <div className="font-heading text-sm font-semibold text-foreground">
                    Family note
                  </div>
                  <div className="mt-1">
                    Progress charts reflect documented scores over time. Session notes help explain what worked during recent practice.
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

