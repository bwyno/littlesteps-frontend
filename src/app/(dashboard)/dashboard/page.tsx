"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Activity,
  CalendarDays,
  ClipboardList,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { ChildCard } from "@/components/child-card";
import { cn } from "@/lib/utils";
import { useChildren, useGoals, useSessions } from "@/lib/api/hooks";
import type { Child, Goal, Session } from "@/types";

function formatDate(dateISO: string) {
  const d = new Date(dateISO);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function daysSince(dateISO: string) {
  const then = new Date(dateISO).getTime();
  const now = Date.now();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

export default function DashboardPage() {
  const childrenQ = useChildren();
  const goalsQ = useGoals();
  const sessionsQ = useSessions();

  const childrenData = childrenQ.data;
  const goalsData = goalsQ.data;
  const sessionsData = sessionsQ.data;

  const loading = childrenQ.isPending || goalsQ.isPending || sessionsQ.isPending;

  const childById = useMemo(() => {
    const map = new Map<string, Child>();
    for (const c of childrenData ?? []) map.set(c.id, c);
    return map;
  }, [childrenData]);

  const goalsByChild = useMemo(() => {
    const map = new Map<string, Goal[]>();
    for (const g of goalsData ?? []) {
      const list = map.get(g.child_id) ?? [];
      list.push(g);
      map.set(g.child_id, list);
    }
    return map;
  }, [goalsData]);

  const recentSessions = useMemo(() => {
    const list = [...(sessionsData ?? [])];
    list.sort((a, b) => (a.date < b.date ? 1 : -1));
    return list;
  }, [sessionsData]);

  const kpis = useMemo(() => {
    const rosterCount = (childrenData ?? []).length;
    const goalCount = (goalsData ?? []).length;
    const sessions = sessionsData ?? [];
    const last14DaysCount = sessions.filter((s) => daysSince(s.date) <= 14).length;
    const lastSessionDate = recentSessions[0]?.date ?? null;
    return {
      rosterCount,
      goalCount,
      last14DaysCount,
      lastSessionDate,
    };
  }, [childrenData, goalsData, sessionsData, recentSessions]);

  const childrenPreview = (childrenData ?? []).slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="clinical-page-title">Dashboard</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Today’s snapshot across your roster: goals, sessions, and next best actions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/sessions"
            className={cn(buttonVariants({ variant: "secondary", size: "default" }), "gap-2")}
          >
            <Activity className="size-4" aria-hidden />
            Log session
          </Link>
          <Link
            href="/goals"
            className={cn(buttonVariants({ variant: "outline", size: "default" }), "gap-2")}
          >
            <Target className="size-4" aria-hidden />
            Add goal
          </Link>
          <Link
            href="/parent-summary"
            className={cn(buttonVariants({ variant: "outline", size: "default" }), "gap-2")}
          >
            <ClipboardList className="size-4" aria-hidden />
            Parent summary
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground inline-flex items-center gap-2">
              <Users className="size-4" aria-hidden />
              Children
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-9 w-20" />
            ) : (
              <div className="text-3xl font-semibold tracking-tight">{kpis.rosterCount}</div>
            )}
            <p className="mt-1 text-xs text-muted-foreground">Active roster size</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground inline-flex items-center gap-2">
              <Target className="size-4" aria-hidden />
              Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-9 w-20" />
            ) : (
              <div className="text-3xl font-semibold tracking-tight">{kpis.goalCount}</div>
            )}
            <p className="mt-1 text-xs text-muted-foreground">Across all domains</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground inline-flex items-center gap-2">
              <CalendarDays className="size-4" aria-hidden />
              Sessions (14 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-9 w-24" />
            ) : (
              <div className="text-3xl font-semibold tracking-tight">{kpis.last14DaysCount}</div>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              {kpis.lastSessionDate ? `Last: ${formatDate(kpis.lastSessionDate)}` : "No sessions logged yet"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground inline-flex items-center gap-2">
              <Sparkles className="size-4 text-primary" aria-hidden />
              Next best action
            </CardTitle>
            <CardDescription>
              Quick actions to keep progress measurable and family-friendly.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link
              href="/progress"
              className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
            >
              Review charts
            </Link>
            <Link
              href="/sessions"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Add note
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">Children</CardTitle>
                <CardDescription>
                  Jump back into the profiles you’ve been working with.
                </CardDescription>
              </div>
              <Link
                href="/children"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
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
            ) : childrenPreview.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {childrenPreview.map((c) => (
                  <div key={c.id} className="space-y-2">
                    <ChildCard child={c} />
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full border border-border/60 bg-muted/20 px-2 py-1">
                        {goalsByChild.get(c.id)?.length ?? 0} goals
                      </span>
                      <span className="rounded-full border border-border/60 bg-muted/20 px-2 py-1">
                        Age {c.age}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Users}
                title="Your roster will show up here"
                description="Add your first goal and the demo roster will start to feel like a real clinic workflow."
                action={
                  <Link
                    href="/goals"
                    className={cn(buttonVariants({ variant: "secondary", size: "default" }), "mt-2")}
                  >
                    Create first goal
                  </Link>
                }
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">Recent sessions</CardTitle>
                <CardDescription>Most recent clinical notes across the roster.</CardDescription>
              </div>
              <Link
                href="/sessions"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-border/60 bg-background/40 p-4">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="mt-2 h-3 w-64" />
                    <Skeleton className="mt-3 h-5 w-full" />
                  </div>
                ))}
              </div>
            ) : recentSessions.length ? (
              recentSessions.slice(0, 5).map((s: Session) => (
                <div
                  key={s.id}
                  className="rounded-xl border border-border/60 bg-background/40 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
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
                  <p className="mt-3 text-sm text-foreground">{s.notes}</p>
                </div>
              ))
            ) : (
              <EmptyState
                icon={Activity}
                title="No sessions logged yet"
                description="Log your first session to start tracking measurable progress over time."
                action={
                  <Link
                    href="/sessions"
                    className={cn(buttonVariants({ variant: "secondary", size: "default" }), "mt-2")}
                  >
                    Log a session
                  </Link>
                }
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

