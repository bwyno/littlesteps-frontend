import type { Child, Goal, ProgressEntry, Session } from "@/types";
import childrenSeed from "@/mock/children.json";
import goalsSeed from "@/mock/goals.json";
import progressSeed from "@/mock/progress.json";
import sessionsSeed from "@/mock/sessions.json";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const children: Child[] = structuredClone(childrenSeed) as Child[];
let goals: Goal[] = structuredClone(goalsSeed) as Goal[];
let progress: ProgressEntry[] = structuredClone(progressSeed) as ProgressEntry[];
let sessions: Session[] = structuredClone(sessionsSeed) as Session[];

export async function getChildren(): Promise<Child[]> {
  await delay(280);
  return [...children];
}

export async function getChildById(id: string): Promise<Child | null> {
  await delay(220);
  return children.find((c) => c.id === id) ?? null;
}

export async function getGoals(): Promise<Goal[]> {
  await delay(260);
  return [...goals];
}

export async function getGoalsByChild(childId: string): Promise<Goal[]> {
  await delay(240);
  return goals.filter((g) => g.child_id === childId);
}

export async function getGoalById(goalId: string): Promise<Goal | null> {
  await delay(180);
  return goals.find((g) => g.id === goalId) ?? null;
}

export async function getGoalProgress(goalId: string): Promise<ProgressEntry[]> {
  await delay(200);
  return progress
    .filter((p) => p.goal_id === goalId)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function getSessions(): Promise<Session[]> {
  await delay(260);
  return [...sessions].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getSessionsByChild(childId: string): Promise<Session[]> {
  await delay(220);
  return sessions
    .filter((s) => s.child_id === childId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function createGoal(
  input: Omit<Goal, "id"> & { id?: string }
): Promise<Goal> {
  await delay(350);
  const id = input.id ?? `g${Date.now()}`;
  const goal: Goal = {
    id,
    child_id: input.child_id,
    domain: input.domain,
    skill: input.skill,
    baseline: input.baseline,
    target: input.target,
  };
  goals = [...goals, goal];
  return goal;
}

export async function logSession(
  input: Omit<Session, "id"> & { id?: string }
): Promise<Session> {
  await delay(400);
  const id = input.id ?? `s${Date.now()}`;
  const session: Session = {
    id,
    child_id: input.child_id,
    date: input.date,
    duration_minutes: input.duration_minutes,
    notes: input.notes,
    goals_addressed: input.goals_addressed,
  };
  sessions = [session, ...sessions];
  return session;
}

export async function addProgressEntry(entry: ProgressEntry): Promise<ProgressEntry> {
  await delay(280);
  progress = [...progress, entry];
  return entry;
}
