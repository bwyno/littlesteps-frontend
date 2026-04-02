"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { Goal, ProgressEntry } from "@/types";
import { cn } from "@/lib/utils";

type Point = { date: string; value: number };

export function ProgressChart({
  goal,
  entries,
  className,
  height = 280,
}: {
  goal: Goal;
  entries: ProgressEntry[];
  className?: string;
  height?: number;
}) {
  const data: Point[] = entries.map((e) => ({
    date: e.date,
    value: e.value,
  }));

  const empty = data.length === 0;

  return (
    <div
      className={cn("w-full min-w-0", className)}
      style={{ height, minHeight: height, width: "100%" }}
    >
      {empty ? (
        <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
          No progress entries yet for this goal.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={data}
            margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              opacity={0.6}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "0.5rem",
                border: "1px solid var(--border)",
                fontSize: "0.75rem",
                background: "var(--popover)",
                color: "var(--popover-foreground)",
              }}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <ReferenceLine
              y={goal.baseline}
              stroke="var(--chart-3)"
              strokeDasharray="4 4"
              label={{
                value: "Baseline",
                position: "insideTopRight",
                fill: "var(--muted-foreground)",
                fontSize: 10,
              }}
            />
            <ReferenceLine
              y={goal.target}
              stroke="var(--primary)"
              strokeDasharray="4 4"
              label={{
                value: "Target",
                position: "insideBottomRight",
                fill: "var(--muted-foreground)",
                fontSize: 10,
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--chart-2)" }}
              activeDot={{ r: 4 }}
              name="Score"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
