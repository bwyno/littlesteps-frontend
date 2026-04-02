import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LittleSteps — Sign in",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8">{children}</div>
    </div>
  );
}

