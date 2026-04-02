"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Goal } from "@/types";
import { useGoalProgress } from "@/lib/api/hooks";
import { ProgressChart } from "@/components/charts/progress-chart";

export function GoalChartPanel({ goal }: { goal: Goal }) {
  const progressQ = useGoalProgress(goal.id);

  if (progressQ.isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{goal.skill}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-base">{goal.skill}</CardTitle>
        <div className="text-sm text-muted-foreground">{goal.domain}</div>
      </CardHeader>
      <CardContent>
        <ProgressChart goal={goal} entries={progressQ.data ?? []} height={320} />
      </CardContent>
    </Card>
  );
}

