"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addProgressEntry,
  createGoal,
  getChildById,
  getChildren,
  getGoalById,
  getGoalProgress,
  getGoals,
  getGoalsByChild,
  getSessions,
  getSessionsByChild,
  logSession,
} from "@/lib/api/client";

export const qk = {
  children: ["children"] as const,
  child: (id: string) => ["child", id] as const,
  goals: ["goals"] as const,
  goalsByChild: (childId: string) => ["goals", "child", childId] as const,
  goal: (id: string) => ["goal", id] as const,
  progress: (goalId: string) => ["progress", goalId] as const,
  sessions: ["sessions"] as const,
  sessionsByChild: (childId: string) => ["sessions", "child", childId] as const,
};

export function useChildren() {
  return useQuery({ queryKey: qk.children, queryFn: getChildren });
}

export function useChild(id: string) {
  return useQuery({
    queryKey: qk.child(id),
    queryFn: () => getChildById(id),
    enabled: Boolean(id),
  });
}

export function useGoals() {
  return useQuery({ queryKey: qk.goals, queryFn: getGoals });
}

export function useGoalsByChild(childId: string) {
  return useQuery({
    queryKey: qk.goalsByChild(childId),
    queryFn: () => getGoalsByChild(childId),
    enabled: Boolean(childId),
  });
}

export function useGoal(goalId: string) {
  return useQuery({
    queryKey: qk.goal(goalId),
    queryFn: () => getGoalById(goalId),
    enabled: Boolean(goalId),
  });
}

export function useGoalProgress(goalId: string) {
  return useQuery({
    queryKey: qk.progress(goalId),
    queryFn: () => getGoalProgress(goalId),
    enabled: Boolean(goalId),
  });
}

export function useSessions() {
  return useQuery({ queryKey: qk.sessions, queryFn: getSessions });
}

export function useSessionsByChild(childId: string) {
  return useQuery({
    queryKey: qk.sessionsByChild(childId),
    queryFn: () => getSessionsByChild(childId),
    enabled: Boolean(childId),
  });
}

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

export function useLogSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: logSession,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

export function useAddProgressEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addProgressEntry,
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({ queryKey: qk.progress(variables.goal_id) });
    },
  });
}
