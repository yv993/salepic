"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { Brand } from "@/components/brand";
import { AppSidebar } from "./app-sidebar";

export function AppHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-md lg:px-8">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open navigation"
            />
          }
        >
          <Menu className="size-5" />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-72 border-sidebar-border bg-sidebar p-0"
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <AppSidebar onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <Link href="/admin" className="lg:hidden">
        <Brand withWordmark={false} />
      </Link>

      <div className="flex-1" />

      <ThemeToggle />
      <Button render={<Link href="/admin/products/new" />}>
        <Plus className="size-4" />
        <span className="hidden sm:inline">New postcard</span>
        <span className="sm:hidden">New</span>
      </Button>
    </header>
  );
}
