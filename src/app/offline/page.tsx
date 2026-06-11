import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "You're offline",
  robots: { index: false },
};

export default function OfflinePage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-muted text-primary">
        <WifiOff className="size-7" />
      </span>
      <h1 className="mt-5 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        You&apos;re offline
      </h1>
      <p className="mt-3 text-muted-foreground">
        It looks like the connection dropped. Check your network and try again —
        the studio will be right here.
      </p>
      <Button className="mt-8" render={<Link href="/" />}>
        Retry
      </Button>
    </div>
  );
}
