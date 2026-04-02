"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Sparkles, UserPlus } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  clinicName: z.string().min(2, "Clinic name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupValues = z.infer<typeof schema>;

export default function SignupPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<SignupValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", clinicName: "", password: "" },
  });

  return (
    <div className="mx-auto flex w-full max-w-md flex-col">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground">
          <UserPlus className="size-5" aria-hidden />
        </div>
        <div>
          <h2 className="font-heading text-xl font-semibold tracking-tight">Create clinic account</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This is a UI-only signup for the MVP (no backend).
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>
            Start tracking goals and progress for pediatric OT programs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(async (values) => {
              setServerError(null);
              try {
                await new Promise((r) => setTimeout(r, 650));
                window.localStorage.setItem("demo_auth", JSON.stringify({ email: values.email, clinicName: values.clinicName }));
                router.replace("/dashboard");
              } catch {
                setServerError("Unable to create account. Please try again.");
              }
            })}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="clinic@domain.com" {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="clinicName">Clinic name</Label>
              <Input id="clinicName" placeholder="LittleSteps OT Clinic" {...form.register("clinicName")} />
              {form.formState.errors.clinicName && (
                <p className="text-xs text-destructive">{form.formState.errors.clinicName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••" {...form.register("password")} />
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>

            {serverError && <p className="text-sm text-destructive">{serverError}</p>}

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="size-4" aria-hidden />
                  Creating…
                </span>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <a className="text-primary underline underline-offset-4" href="/login">
              Sign in
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

