"use client"

import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { Goal, ProgressEntry } from "@/types";
import { useGoalProgress } from "@/lib/api/hooks";

function latestScore(entries: ProgressEntry[]): number | null {
  if (!entries.length) return null;
  return entries[entries.length - 1].value;
}

export function PrintGoalItem({ goal }: { goal: Goal }) {
  const progressQ = useGoalProgress(goal.id);

  if (progressQ.isPending) {
    return (
      <div className="print-goal-item rounded-lg border border-border/60 bg-background/40 p-3">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="mt-2 h-3 w-32" />
        <Skeleton className="mt-3 h-2 w-full" />
      </div>
    );
  }

  const entries = progressQ.data ?? [];
  const current = latestScore(entries);
  const range = goal.target - goal.baseline;
  const pct =
    current != null && range !== 0
      ? Math.min(100, Math.max(0, Math.round(((current - goal.baseline) / range) * 100)))
      : 0;

  return (
    <div className="print-goal-item rounded-lg border border-border/60 bg-background/40 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-[200px] space-y-1">
          <div className="text-sm font-semibold leading-snug">{goal.skill}</div>
          <div className="text-xs text-muted-foreground">{goal.domain}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="rounded-full text-xs">
            {goal.baseline}→{goal.target}%
          </Badge>
          <Badge variant="secondary" className="rounded-full text-xs">
            {current != null ? `${current}%` : "No data"}
          </Badge>
        </div>
      </div>
      <div className="mt-3">
        <Progress value={pct} className="h-2" />
      </div>
    </div>
  );
}

