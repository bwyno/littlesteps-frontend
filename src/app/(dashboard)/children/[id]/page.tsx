"use client"

import { useParams } from "next/navigation";
import { Calendar, MessageSquareText, Pill, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { GoalCardWithProgress } from "@/components/goals/goal-card-with-progress";
import { useChild, useGoalsByChild, useSessionsByChild } from "@/lib/api/hooks";
import type { Child, Goal, Session } from "@/types";

function formatDate(dateISO: string) {
  const d = new Date(dateISO);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

export default function ChildProfilePage() {
  const params = useParams();
  const id = params?.id;

  const childQ = useChild(String(id));
  const goalsQ = useGoalsByChild(String(id));
  const sessionsQ = useSessionsByChild(String(id));

  const loading = childQ.isPending || goalsQ.isPending || sessionsQ.isPending;

  if (childQ.data === null) {
    return (
      <EmptyState
        icon={Star}
        title="Child not found"
        description="The selected child id does not exist in the mocked dataset."
      />
    );
  }

  const child = childQ.data as Child | null;
  const goals = goalsQ.data ?? [];
  const sessions = sessionsQ.data ?? [];
  const recentSessions = sessions.slice(0, 4);

  if (loading || !child) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="mt-2 h-4 w-72" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-border/60 bg-background/40 p-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="mt-2 h-3 w-20" />
                    <Skeleton className="mt-3 h-2 w-full" />
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
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
          <p className="clinical-page-title">{child.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Age {child.age} · Diagnosis snapshot
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {child.diagnosis.map((d) => (
            <Badge key={d} variant="secondary">
              {d}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Goals</CardTitle>
            <CardDescription>Current baseline → target and recent progress</CardDescription>
          </CardHeader>
          <CardContent>
            {goals.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {goals.map((g: Goal) => (
                  <GoalCardWithProgress key={g.id} goal={g} childName={child.name} readOnly />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Star}
                title="No goals for this child"
                description="Create a goal from the Goals page. Your progress charts will be driven by progress entries."
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent sessions</CardTitle>
            <CardDescription>Latest clinic notes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentSessions.length ? (
              recentSessions.map((s: Session) => (
                <div
                  key={s.id}
                  className="rounded-xl border border-border/60 bg-background/40 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground inline-flex items-center gap-2">
                        <Calendar className="size-3.5" aria-hidden />
                        {formatDate(s.date)}
                      </p>
                      <p className="text-sm font-semibold">{s.duration_minutes} minutes</p>
                    </div>
                    <div className="shrink-0">
                      <Badge variant="outline" className="rounded-full">
                        {s.goals_addressed.length} goals
                      </Badge>
                    </div>
                  </div>
                  <p className="mt-3 text-sm">{s.notes}</p>
                  {s.goals_addressed.length ? (
                    <div className="mt-3 flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                      <Pill className="size-3" aria-hidden />
                      {s.goals_addressed.join(", ")}
                    </div>
                  ) : null}
                </div>
              ))
            ) : (
              <EmptyState
                icon={MessageSquareText}
                title="No sessions logged"
                description="Log a session to capture clinic observations and (optionally) update goal progress."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

