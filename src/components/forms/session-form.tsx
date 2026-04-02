"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAddProgressEntry, useLogSession } from "@/lib/api/hooks";
import type { Child, Goal } from "@/types";

const schema = z.object({
  child_id: z.string().min(1, "Select a child"),
  date: z.string().min(1, "Date is required"),
  duration_minutes: z.number().min(5, "At least 5 minutes").max(240),
  notes: z.string().min(1, "Notes help your team stay aligned").max(2000),
  goal_id: z.string().optional(),
  progress_value: z.number().min(0).max(100).optional(),
});

export type SessionFormValues = z.infer<typeof schema>;

export function SessionForm({
  childrenList,
  goals,
  onSuccess,
}: {
  childrenList: Child[];
  goals: Goal[];
  onSuccess?: () => void;
}) {
  const logSession = useLogSession();
  const addProgressEntry = useAddProgressEntry();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<SessionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      child_id: childrenList[0]?.id ?? "",
      date: new Date().toISOString().slice(0, 10),
      duration_minutes: 45,
      notes: "",
      goal_id: undefined,
      progress_value: undefined,
    },
  });

  const childId = watch("child_id");
  const childGoals = useMemo(
    () => goals.filter((g) => g.child_id === childId),
    [goals, childId]
  );

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (values) => {
        const goals_addressed = values.goal_id ? [values.goal_id] : [];
        await logSession.mutateAsync({
          child_id: values.child_id,
          date: values.date,
          duration_minutes: values.duration_minutes,
          notes: values.notes.trim(),
          goals_addressed,
        });

        if (values.goal_id && values.progress_value != null) {
          await addProgressEntry.mutateAsync({
            goal_id: values.goal_id,
            date: values.date,
            value: values.progress_value,
          });
        }

        reset({
          child_id: values.child_id,
          date: new Date().toISOString().slice(0, 10),
          duration_minutes: 45,
          notes: "",
          goal_id: undefined,
          progress_value: undefined,
        });
        onSuccess?.();
      })}
    >
      <div className="space-y-2">
        <Label htmlFor="session-child">Child</Label>
        <Select
          value={childId || undefined}
          onValueChange={(v) => {
            setValue("child_id", v ?? "", { shouldValidate: true });
            setValue("goal_id", undefined);
            setValue("progress_value", undefined);
          }}
        >
          <SelectTrigger id="session-child" className="w-full min-w-0">
            <SelectValue placeholder="Select child" />
          </SelectTrigger>
          <SelectContent>
            {childrenList.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.child_id && (
          <p className="text-xs text-destructive">{errors.child_id.message}</p>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="session-date">Date</Label>
          <Input id="session-date" type="date" {...register("date")} />
          {errors.date && (
            <p className="text-xs text-destructive">{errors.date.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            min={5}
            max={240}
              {...register("duration_minutes", { valueAsNumber: true })}
          />
          {errors.duration_minutes && (
            <p className="text-xs text-destructive">
              {errors.duration_minutes.message}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="primary-goal">Primary goal addressed (optional)</Label>
        <Select
          value={watch("goal_id") || undefined}
          onValueChange={(v) => {
            setValue("goal_id", v ?? undefined, { shouldValidate: true });
            setValue("progress_value", undefined);
          }}
        >
          <SelectTrigger id="primary-goal" className="w-full min-w-0">
            <SelectValue placeholder="Select a goal for this session" />
          </SelectTrigger>
          <SelectContent>
            {childGoals.map((g) => (
              <SelectItem key={g.id} value={g.id}>
                {g.skill}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {watch("goal_id") ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="progress_value">Progress score (optional)</Label>
            <Input
              id="progress_value"
              type="number"
              min={0}
              max={100}
              placeholder="e.g. 45"
              {...register("progress_value", {
                setValueAs: (v) => {
                  if (v === "" || v == null) return undefined;
                  const n = Number(v);
                  return Number.isFinite(n) ? n : undefined;
                },
              })}
            />
            {errors.progress_value && (
              <p className="text-xs text-destructive">{errors.progress_value.message}</p>
            )}
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/10 p-3 text-xs text-muted-foreground">
            Leave blank to log the session without adding a new progress point.
          </div>
        </div>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="notes">Session notes</Label>
        <Textarea
          id="notes"
          rows={4}
          placeholder="Activities, cues, and observations…"
          {...register("notes")}
        />
        {errors.notes && (
          <p className="text-xs text-destructive">{errors.notes.message}</p>
        )}
      </div>
      <Button type="submit" disabled={logSession.isPending}>
        {logSession.isPending ? "Saving…" : "Log session"}
      </Button>
    </form>
  );
}
