"use client";

import { Stamp, Truck, Undo2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const TABS = [
  {
    value: "details",
    icon: Stamp,
    label: "Details",
    body:
      "Every postcard is hand-illustrated and printed in small batches on A6 (148 × 105 mm) recycled card stock with a soft matte finish that takes ink beautifully. No mass production — when a run sells out, it's genuinely gone.",
  },
  {
    value: "shipping",
    icon: Truck,
    label: "Shipping",
    body:
      "Packed flat in a rigid mailer to keep corners crisp, then sent tracked. Most orders post within 2 business days. Flat-rate worldwide shipping, free over the threshold shown at checkout.",
  },
  {
    value: "returns",
    icon: Undo2,
    label: "Returns",
    body:
      "If a card arrives damaged, reply to your confirmation email with a photo and we'll send a replacement straightaway — no card should ever arrive bent.",
  },
];

export function DetailTabs() {
  return (
    <section className="border-b border-border/60 bg-card/40">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Tabs defaultValue="details" className="gap-6">
          <TabsList className="mx-auto flex h-auto flex-wrap justify-center gap-2 bg-transparent p-0">
            {TABS.map((t) => {
              const Icon = t.icon;
              return (
                <TabsTrigger
                  key={t.value}
                  value={t.value}
                  className="flex-none gap-2 rounded-full border border-border bg-background px-5 py-2.5 data-active:border-primary/40 data-active:bg-primary data-active:text-primary-foreground"
                >
                  <Icon className="size-4" />
                  {t.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
          {TABS.map((t) => (
            <TabsContent key={t.value} value={t.value} className="mx-auto max-w-2xl text-center">
              <p className="text-pretty text-base leading-relaxed text-muted-foreground">
                {t.body}
              </p>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
