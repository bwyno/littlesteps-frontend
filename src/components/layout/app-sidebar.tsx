"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  Baby,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
  ClipboardList,
  LayoutDashboard,
  LineChart,
  Stethoscope,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/children", label: "Children", icon: Baby },
  { href: "/goals", label: "Goals", icon: ClipboardList },
  { href: "/sessions", label: "Sessions", icon: Activity },
  { href: "/progress", label: "Progress", icon: LineChart },
  { href: "/parent-summary", label: "Family summary", icon: Users },
];

export function AppSidebar({
  collapsed = false,
  mobileOpen = false,
  onCollapsedChange,
  onNavigate,
}: {
  collapsed?: boolean;
  mobileOpen?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const mobileTransform = mobileOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <aside
      className={cn(
        "no-print fixed left-0 top-0 z-20 flex h-[100vh] flex-col overflow-hidden border-r border-border/80 bg-sidebar text-sidebar-foreground transition-[transform,width] duration-200 ease-out motion-reduce:transition-none md:translate-x-0",
        mobileTransform,
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className={cn(
        "flex border-b border-sidebar-border px-4 py-4",
          collapsed ? "px-2 justify-center items-center" : "justify-between"
        )}
      >
        <div
          className="flex items-center justify-center"
        >
          <div className={cn("group/logo relative", collapsed ? "block" : "")}>
            <div
              className={cn(
                "flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary",
                "transition-[opacity,transform,filter] duration-200 ease-out motion-reduce:transition-none",
                collapsed &&
                  "group-hover/logo:opacity-0 group-hover/logo:scale-[0.92] group-hover/logo:blur-[1px]"
              )}
            >
              <Stethoscope className="size-5" aria-hidden />
            </div>

            {/* Collapsed (desktop): show expand button on logo hover */}
            {collapsed ? (
              <button
                type="button"
                className={cn(
                  "hidden md:inline-flex absolute inset-0 items-center justify-center rounded-lg border border-sidebar-border bg-background/70 text-foreground/70 shadow-sm",
                  "opacity-0 pointer-events-none",
                  "transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
                  "scale-[0.96]",
                  "group-hover/logo:opacity-100 group-hover/logo:pointer-events-auto",
                  "group-hover/logo:scale-100",
                  "hover:bg-sidebar-accent hover:text-foreground"
                )}
                aria-label="Expand sidebar"
                onClick={() => onCollapsedChange?.(false)}
              >
                <ChevronRight
                  className={cn(
                    "size-4",
                    "transition-transform duration-200 ease-out motion-reduce:transition-none",
                    "group-hover/logo:translate-x-[1px]"
                  )}
                  aria-hidden
                />
              </button>
            ) : null}
          </div>
          <div
            className={cn(
              "min-w-0 flex-1 overflow-hidden",
              "transition-[opacity,transform,max-width] duration-200 ease-out motion-reduce:transition-none",
              collapsed
                ? "opacity-0 -translate-x-1 max-w-0 pointer-events-none"
                : "pl-2 opacity-100 translate-x-0 max-w-[14rem]"
            )}
            aria-hidden={collapsed}
          >
            <p className="truncate font-heading text-sm font-semibold tracking-tight">
              LittleSteps
            </p>
            <p className="truncate text-xs text-muted-foreground">OT Tracker</p>
          </div>

          {/* Mobile: close button */}
          <button
            type="button"
            className={cn(
              "md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-sidebar-border bg-background/40 text-foreground/80 transition-colors hover:bg-sidebar-accent",
              collapsed && "hidden"
            )}
            aria-label="Close navigation"
            onClick={() => onNavigate?.()}
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        {/* Desktop: collapse toggle (expanded state only) */}
        {!collapsed && (
          <div className={cn("hidden flex items-center justify-center ")}>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-sidebar-border bg-background/40 text-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-foreground"
              aria-label="Collapse sidebar"
              onClick={() => onCollapsedChange?.(true)}
            >
              <span className="inline-flex transition-transform duration-200 motion-reduce:transition-none">
                <ChevronLeft className="size-4" aria-hidden />
              </span>
            </button>
          </div>
        )}
      </div>
      <nav
        className={cn(
          "flex flex-1 flex-col gap-0.5 overflow-y-auto p-2",
          collapsed ? "items-center" : "items-stretch"
        )}
      >
        {nav.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onNavigate?.()}
              className={cn(
                "group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                collapsed && "justify-center px-2 gap-0",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-4 shrink-0 opacity-80" aria-hidden />
              <span
                className={cn(
                  "whitespace-nowrap",
                  "transition-[opacity,transform,max-width] duration-200 ease-out motion-reduce:transition-none",
                  collapsed
                    ? "opacity-0 translate-x-1 max-w-0 overflow-hidden pointer-events-none"
                    : "opacity-100 translate-x-0 max-w-[14rem]"
                )}
                aria-hidden={collapsed}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Sign out as nav item */}
        <div className="mt-auto pt-2">
          <button
            type="button"
            disabled={signingOut}
            onClick={async () => {
              setSigningOut(true);
              window.localStorage.removeItem("demo_auth");
              router.push("/login");
            }}
            className={cn(
              "group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              collapsed && "justify-center px-2 gap-0",
              "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground disabled:opacity-60"
            )}
            aria-label="Sign out"
          >
            <LogOut className="size-4 shrink-0 opacity-80" aria-hidden />
            <span
              className={cn(
                "whitespace-nowrap",
                "transition-[opacity,transform,max-width] duration-200 ease-out motion-reduce:transition-none",
                collapsed
                  ? "opacity-0 translate-x-1 max-w-0 overflow-hidden pointer-events-none"
                  : "opacity-100 translate-x-0 max-w-[14rem]"
              )}
              aria-hidden={collapsed}
            >
              {signingOut ? "Signing out…" : "Sign out"}
            </span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
