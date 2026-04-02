"use client"

import { useMemo, useState } from "react";
import { ClipboardList, Sparkles } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/empty-state";
import { GoalForm } from "@/components/forms/goal-form";
import { GoalCardWithProgress } from "@/components/goals/goal-card-with-progress";
import { Button } from "@/components/ui/button";
import { useChildren, useGoals } from "@/lib/api/hooks";
import type { Child, Goal } from "@/types";
import { Badge } from "@/components/ui/badge";

export default function GoalsPage() {
  const childrenQ = useChildren();
  const goalsQ = useGoals();

  const children = childrenQ.data ?? [];
  const goals = goalsQ.data ?? [];

  const [childId, setChildId] = useState<string>("all");

  const childById = useMemo(() => {
    const map = new Map<string, Child>();
    for (const c of children) map.set(c.id, c);
    return map;
  }, [children]);

  const filteredGoals = childId === "all" ? goals : goals.filter((g) => g.child_id === childId);
  const loading = childrenQ.isPending || goalsQ.isPending;

  const selectedChild = childId !== "all" ? childById.get(childId) ?? null : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="clinical-page-title">Goals</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create goals, review baseline/target, and open progress charts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="rounded-full">
            {goals.length} goals
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base inline-flex items-center gap-2">
              <Sparkles className="size-4" aria-hidden />
              Create goal
            </CardTitle>
            <CardDescription>Set baseline and target, linked to a child.</CardDescription>
          </CardHeader>
          <CardContent>
            {children.length ? (
              <GoalForm
                childrenList={children}
                onSuccess={() => {
                  setChildId("all");
                }}
              />
            ) : (
              <div className="space-y-3">
                <Skeleton className="h-6 w-52" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-base inline-flex items-center gap-2">
                  <ClipboardList className="size-4" aria-hidden />
                  Existing goals
                </CardTitle>
                <CardDescription>
                  {selectedChild ? `Filtered for ${selectedChild.name}` : "All children"}
                </CardDescription>
              </div>
              <div className="w-full sm:w-56">
                <Select
                  value={childId}
                  onValueChange={(v) => setChildId(v ?? "all")}
                >
                  <SelectTrigger className="w-full min-w-0">
                    <SelectValue placeholder="Filter by child" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All children</SelectItem>
                    {children.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-border/60 bg-background/40 p-4">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="mt-2 h-3 w-32" />
                    <div className="mt-4 space-y-2">
                      <Skeleton className="h-2 w-full" />
                      <Skeleton className="h-2 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredGoals.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredGoals.map((g: Goal) => (
                  <GoalCardWithProgress
                    key={g.id}
                    goal={g}
                    childName={childById.get(g.child_id)?.name}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={ClipboardList}
                title={childId === "all" ? "No goals yet" : "No goals for this child"}
                description="Create your first goal and start logging progress."
                action={
                  <Button variant="outline" onClick={() => setChildId("all")}>
                    View all goals
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

