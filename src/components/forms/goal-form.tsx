"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useCreateGoal } from "@/lib/api/hooks";
import type { Child } from "@/types";

const schema = z
  .object({
    child_id: z.string().min(1, "Select a child"),
    domain: z.string().min(1, "Domain is required").max(120),
    skill: z.string().min(1, "Skill is required").max(200),
    baseline: z.number().min(0).max(100),
    target: z.number().min(0).max(100),
  })
  .refine((data) => data.target > data.baseline, {
    message: "Target should be above baseline",
    path: ["target"],
  });

export type GoalFormValues = z.infer<typeof schema>;

export function GoalForm({
  childrenList,
  onSuccess,
}: {
  childrenList: Child[];
  onSuccess?: () => void;
}) {
  const createGoal = useCreateGoal();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<GoalFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      child_id: childrenList[0]?.id ?? "",
      domain: "",
      skill: "",
      baseline: 0,
      target: 0,
    },
  });

  const childId = watch("child_id");

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (values) => {
        await createGoal.mutateAsync({
          child_id: values.child_id,
          domain: values.domain.trim(),
          skill: values.skill.trim(),
          baseline: values.baseline,
          target: values.target,
        });
        reset({
          child_id: values.child_id,
          domain: "",
          skill: "",
          baseline: 0,
          target: 0,
        });
        onSuccess?.();
      })}
    >
      <div className="space-y-2">
        <Label htmlFor="goal-child">Child</Label>
        <Select
          value={childId || undefined}
          onValueChange={(v) => setValue("child_id", v ?? "", { shouldValidate: true })}
        >
          <SelectTrigger id="goal-child" className="w-full min-w-0" size="default">
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
          <Label htmlFor="domain">Domain</Label>
          <Input id="domain" placeholder="e.g. Fine Motor" {...register("domain")} />
          {errors.domain && (
            <p className="text-xs text-destructive">{errors.domain.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="skill">Skill</Label>
          <Input id="skill" placeholder="e.g. Pincer grasp" {...register("skill")} />
          {errors.skill && (
            <p className="text-xs text-destructive">{errors.skill.message}</p>
          )}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="baseline">Baseline (%)</Label>
          <Input
            id="baseline"
            type="number"
            min={0}
            max={100}
            {...register("baseline", { valueAsNumber: true })}
          />
          {errors.baseline && (
            <p className="text-xs text-destructive">{errors.baseline.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="target">Target (%)</Label>
          <Input
            id="target"
            type="number"
            min={0}
            max={100}
            {...register("target", { valueAsNumber: true })}
          />
          {errors.target && (
            <p className="text-xs text-destructive">{errors.target.message}</p>
          )}
        </div>
      </div>
      <Button type="submit" disabled={createGoal.isPending}>
        {createGoal.isPending ? "Saving…" : "Create goal"}
      </Button>
    </form>
  );
}
