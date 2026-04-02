"use client"

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LineChart as LineChartIcon, Sparkles } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { GoalChartPanel } from "@/components/charts/goal-chart-panel";
import { useChildren, useGoals } from "@/lib/api/hooks";
import { Badge } from "@/components/ui/badge";

export default function ProgressPage() {
  const searchParams = useSearchParams();
  const goalParam = searchParams.get("goal") ?? "";

  const childrenQ = useChildren();
  const goalsQ = useGoals();

  const children = childrenQ.data ?? [];
  const goals = goalsQ.data ?? [];

  const [childId, setChildId] = useState<string>("");
  const [activeGoalId, setActiveGoalId] = useState<string>("");

  const childIdFromGoal = useMemo(() => {
    if (!goalParam) return null;
    return goals.find((g) => g.id === goalParam)?.child_id ?? null;
  }, [goals, goalParam]);

  const defaultChildId = useMemo(() => {
    return childIdFromGoal ?? children[0]?.id ?? "";
  }, [childIdFromGoal, children]);

  const effectiveChildId = childId || defaultChildId;

  const goalsForChild = useMemo(() => {
    return effectiveChildId
      ? goals.filter((g) => g.child_id === effectiveChildId)
      : [];
  }, [effectiveChildId, goals]);

  const loading = childrenQ.isPending || goalsQ.isPending;

  const familyName =
    effectiveChildId
      ? children.find((c) => c.id === effectiveChildId)?.name ?? "—"
      : "—";

  const hasManualChildSelection = Boolean(childId);
  const wantedGoalId = !hasManualChildSelection && goalParam
    ? goalParam
    : activeGoalId;

  const computedActiveGoalId = useMemo(() => {
    if (!goalsForChild.length) return "";
    if (wantedGoalId && goalsForChild.some((g) => g.id === wantedGoalId)) {
      return wantedGoalId;
    }
    return goalsForChild[0].id;
  }, [goalsForChild, wantedGoalId]);

  const activeGoal = computedActiveGoalId
    ? goalsForChild.find((g) => g.id === computedActiveGoalId) ?? null
    : null;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <Skeleton className="h-9 w-52" />
          <Skeleton className="h-10 w-56" />
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="grid gap-4 p-6 lg:grid-cols-[360px_1fr]">
              <Skeleton className="h-80 w-full rounded-xl" />
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="clinical-page-title inline-flex items-center gap-2">
            <LineChartIcon className="size-5" aria-hidden />
            Progress
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Line charts per goal, showing progress over time.
          </p>
        </div>
        <div className="w-full md:w-56">
          <Select
            value={effectiveChildId || undefined}
            onValueChange={(v) => {
              setChildId(v ?? "");
              setActiveGoalId("");
            }}
          >
            <SelectTrigger className="w-full min-w-0">
              <SelectValue placeholder="Select child" />
            </SelectTrigger>
            <SelectContent>
              {children.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base inline-flex items-center gap-2">
            <Sparkles className="size-4" aria-hidden />
            {familyName}
          </CardTitle>
          <CardDescription>
            {goalsForChild.length ? `${goalsForChild.length} goals tracked` : "No goals for this child yet"}
          </CardDescription>
          {activeGoal ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="rounded-full">
                Baseline {activeGoal.baseline}%
              </Badge>
              <Badge variant="outline" className="rounded-full">
                Target {activeGoal.target}%
              </Badge>
            </div>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-4">
          {goalsForChild.length ? (
            <Tabs
              value={computedActiveGoalId}
              onValueChange={(v) => setActiveGoalId(v ?? "")}
            >
              <TabsList className="flex w-full flex-wrap justify-start gap-2 bg-transparent p-0">
                {goalsForChild.map((g) => (
                  <TabsTrigger key={g.id} value={g.id} className="data-[state=active]:bg-muted/60">
                    {g.skill}
                  </TabsTrigger>
                ))}
              </TabsList>

              {goalsForChild.map((g) => (
                <TabsContent key={g.id} value={g.id}>
                  {g.id === computedActiveGoalId ? (
                    <GoalChartPanel goal={g} />
                  ) : null}
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <EmptyState
              icon={Sparkles}
              title="No goals available"
              description="Create goals for this child to unlock progress charts."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

