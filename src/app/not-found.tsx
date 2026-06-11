import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LostPostcard } from "@/components/store/lost-postcard";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="relative w-full max-w-md text-center">
        <div className="spotlight pointer-events-none absolute inset-x-0 -top-20 h-72" />
        <LostPostcard />
        <p className="stamp-label text-primary">Return to sender</p>
        <h1 className="mt-3 font-heading text-6xl font-bold tracking-tight">
          404
        </h1>
        <p className="mt-3 text-muted-foreground">
          This postcard seems to have gone astray. Let&apos;s get you back to the
          studio.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Button render={<Link href="/" />}>Home</Button>
          <Button variant="outline" render={<Link href="/postcards" />}>
            Browse postcards
          </Button>
        </div>
      </div>
    </div>
  );
}
