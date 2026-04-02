"use client"

import { useState } from "react";
import { ChevronLeft, Menu, ChevronRight } from "lucide-react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { ChildrenPicker } from "@/components/layout/children-picker";
import { cn } from "@/lib/utils";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-10 bg-black/30 md:hidden transition-opacity",
          mobileSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setMobileSidebarOpen(false)}
      />

      <AppSidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onNavigate={() => setMobileSidebarOpen(false)}
      />

      <div className="min-h-screen md:pl-60">
        <header className="no-print sticky top-0 z-20 border-b border-border/80 bg-background/90 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/75 md:px-8 print:hidden">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              {/* Mobile: open sidebar */}
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/80 bg-background/50 text-foreground/80 transition-colors hover:bg-muted md:hidden"
                aria-label="Open navigation"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu className="size-4" aria-hidden />
              </button>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Clinical workspace
                </p>
                <h1 className="font-heading text-lg font-semibold text-foreground">
                  Pediatric OT — Goals &amp; progress
                </h1>
              </div>
            </div>

            <div className="hidden md:block">
              <ChildrenPicker />
            </div>
            <div className="md:hidden flex-1">
              <ChildrenPicker />
            </div>

            {/* Desktop: collapse/expand */}
            <button
              type="button"
              className="hidden md:flex h-9 w-9 items-center justify-center rounded-lg border border-border/80 bg-background/50 text-foreground/80 transition-colors hover:bg-muted"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setSidebarCollapsed((v) => !v)}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="size-4" aria-hidden />
              ) : (
                <ChevronLeft className="size-4" aria-hidden />
              )}
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
