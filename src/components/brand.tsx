import Link from "next/link";
import { Stamp } from "lucide-react";
import { cn } from "@/lib/utils";

export function Brand({
  className,
  withWordmark = true,
  href,
}: {
  className?: string;
  withWordmark?: boolean;
  href?: string;
}) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/25 [clip-path:polygon(0_6%,6%_0,94%_0,100%_6%,100%_94%,94%_100%,6%_100%,0_94%)]">
        <Stamp className="size-5" />
      </span>
      {withWordmark && (
        <span className="font-heading text-xl font-bold tracking-tight text-foreground">
          Posted<span className="text-primary">.</span>
        </span>
      )}
    </span>
  );

  return href ? (
    <Link href={href} className="inline-flex">
      {content}
    </Link>
  ) : (
    content
  );
}
