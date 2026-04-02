export interface Child {
  id: string;
  name: string;
  age: number;
  diagnosis: string[];
}

export interface Goal {
  id: string;
  child_id: string;
  domain: string;
  skill: string;
  baseline: number;
  target: number;
}

export interface ProgressEntry {
  goal_id: string;
  date: string;
  value: number;
}

export interface Session {
  id: string;
  child_id: string;
  date: string;
  duration_minutes: number;
  notes: string;
  goals_addressed: string[];
}

export type GoalProgressSeries = {
  goal: Goal;
  entries: ProgressEntry[];
};
