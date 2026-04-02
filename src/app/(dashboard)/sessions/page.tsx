"use client"

import { useMemo, useState } from "react";
import { Activity, Clock, MessageSquareText } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SessionForm } from "@/components/forms/session-form";
import { useChildren, useGoals, useSessions } from "@/lib/api/hooks";
import type { Child, Goal, Session } from "@/types";

function formatDate(dateISO: string) {
  const d = new Date(dateISO);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

export default function SessionsPage() {
  const childrenQ = useChildren();
  const goalsQ = useGoals();
  const sessionsQ = useSessions();

  const children = childrenQ.data ?? [];
  const goals = goalsQ.data ?? [];
  const sessions = sessionsQ.data ?? [];

  const childById = useMemo(() => {
    const map = new Map<string, Child>();
    for (const c of children) map.set(c.id, c);
    return map;
  }, [children]);

  const [filterChild, setFilterChild] = useState<string>("all");
  const filteredSessions =
    filterChild === "all"
      ? sessions
      : sessions.filter((s) => s.child_id === filterChild);

  const loading = childrenQ.isPending || goalsQ.isPending || sessionsQ.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="clinical-page-title">Sessions</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Log observations from each pediatric OT session and optionally attach a goal.
          </p>
        </div>
        <div className="w-full md:w-56">
          <Select
            value={filterChild}
            onValueChange={(v) => setFilterChild(v ?? "all")}
          >
            <SelectTrigger className="w-full min-w-0">
              <SelectValue placeholder="Filter" />
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

      <div className="grid gap-4 lg:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base inline-flex items-center gap-2">
              <Activity className="size-4" aria-hidden />
              Log a session
            </CardTitle>
            <CardDescription>Clinical notes, duration, and a primary goal (optional).</CardDescription>
          </CardHeader>
          <CardContent>
            {children.length ? (
              <SessionForm childrenList={children} goals={goals} />
            ) : (
              <div className="space-y-3">
                <Skeleton className="h-6 w-52" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent sessions</CardTitle>
            <CardDescription>
              {filterChild === "all"
                ? "All recent notes"
                : `Showing sessions for ${childById.get(filterChild)?.name ?? "—"}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-border/60 bg-background/40 p-4">
                    <Skeleton className="h-4 w-56" />
                    <Skeleton className="mt-2 h-3 w-40" />
                    <Skeleton className="mt-3 h-5 w-full" />
                  </div>
                ))}
              </div>
            ) : filteredSessions.length ? (
              filteredSessions.slice(0, 6).map((s: Session) => (
                <div key={s.id} className="rounded-xl border border-border/60 bg-background/40 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground inline-flex items-center gap-2">
                        <Clock className="size-3.5" aria-hidden />
                        {formatDate(s.date)}
                      </p>
                      <p className="text-sm font-semibold">
                        {childById.get(s.child_id)?.name ?? "Unknown child"}
                      </p>
                    </div>
                    <Badge variant="outline" className="rounded-full">
                      {s.duration_minutes} min
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-start gap-2">
                    <MessageSquareText className="mt-0.5 size-4 text-muted-foreground" aria-hidden />
                    <p className="text-sm text-foreground">{s.notes}</p>
                  </div>
                  {s.goals_addressed.length ? (
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {s.goals_addressed.map((gid) => {
                        const g = goals.find((gg: Goal) => gg.id === gid);
                        return (
                          <span key={gid} className="rounded-full border border-border/60 bg-muted/20 px-2 py-1">
                            {g ? g.skill : gid}
                          </span>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              ))
            ) : (
              <EmptyState
                icon={Activity}
                title="No sessions match"
                description="Choose a different child filter or log a new session."
                action={
                  <Button variant="outline" onClick={() => setFilterChild("all")}>
                    Clear filter
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

