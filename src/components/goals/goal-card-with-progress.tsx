"use client"

import { Skeleton } from "@/components/ui/skeleton";
import { GoalCard } from "@/components/goal-card";
import type { Goal } from "@/types";
import { useGoalProgress } from "@/lib/api/hooks";

export function GoalCardWithProgress({
  goal,
  childName,
  readOnly,
}: {
  goal: Goal;
  childName?: string;
  readOnly?: boolean;
}) {
  const progressQ = useGoalProgress(goal.id);

  if (progressQ.isPending) {
    return (
      <div className="rounded-xl border border-border/60 bg-background/40 p-4">
        <Skeleton className="h-5 w-56" />
        <Skeleton className="mt-2 h-3 w-32" />
        <div className="mt-4 space-y-2">
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-2 w-2/3" />
        </div>
      </div>
    );
  }

  const entries = progressQ.data ?? [];

  return (
    <GoalCard
      goal={goal}
      childName={childName}
      progressEntries={entries}
      readOnly={readOnly}
    />
  );
}

