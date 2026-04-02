import Link from "next/link";
import { Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Goal } from "@/types";
import { cn } from "@/lib/utils";

function latestScore(entries: { value: number }[]): number | null {
  if (!entries.length) return null;
  return entries[entries.length - 1].value;
}

export function GoalCard({
  goal,
  childName,
  progressEntries,
  readOnly,
}: {
  goal: Goal;
  childName?: string;
  progressEntries: { value: number }[];
  readOnly?: boolean;
}) {
  const current = latestScore(progressEntries);
  const range = goal.target - goal.baseline;
  const pct =
    current != null && range !== 0
      ? Math.min(
          100,
          Math.max(0, Math.round(((current - goal.baseline) / range) * 100))
        )
      : 0;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{goal.skill}</CardTitle>
            <CardDescription>
              {goal.domain}
              {childName ? ` · ${childName}` : ""}
            </CardDescription>
          </div>
          <Badge variant="outline" className="shrink-0 font-normal">
            {goal.baseline}→{goal.target}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Target className="size-3.5" aria-hidden />
            Progress to target
          </span>
          <span>{current != null ? `${current}% current` : "No data"}</span>
        </div>
        <Progress value={pct} className="h-2" />
      </CardContent>
      {!readOnly && (
        <CardFooter className="justify-end border-t-0 pt-0">
          <Link
            href={`/progress?goal=${goal.id}`}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            View chart
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
