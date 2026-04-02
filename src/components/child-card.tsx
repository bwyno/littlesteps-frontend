import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Child } from "@/types";
import { cn } from "@/lib/utils";

export function ChildCard({
  child,
  readOnly,
}: {
  child: Child;
  readOnly?: boolean;
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{child.name}</CardTitle>
        <CardDescription>Age {child.age}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-1.5">
        {child.diagnosis.map((d) => (
          <Badge key={d} variant="secondary" className="font-normal">
            {d}
          </Badge>
        ))}
      </CardContent>
      {!readOnly && (
        <CardFooter className="justify-end border-t-0 pt-0">
          <Link
            href={`/children/${child.id}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "inline-flex gap-1"
            )}
          >
            View profile
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        </CardFooter>
      )}
      {readOnly && (
        <CardFooter className="border-t-0 pt-0 text-xs text-muted-foreground">
          Shared read-only summary for families
        </CardFooter>
      )}
    </Card>
  );
}
