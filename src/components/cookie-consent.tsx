"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const KEY = "posted-cookie-consent";

/** Lightweight cookie/consent banner. Choice persists in localStorage; other
 *  features (e.g. analytics) can read `localStorage[KEY] === "accepted"`. */
export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* ignore */
    }
  }, []);

  function decide(choice: "accepted" | "declined") {
    try {
      localStorage.setItem(KEY, choice);
    } catch {
      /* ignore */
    }
    setShow(false);
    if (choice === "accepted") {
      window.dispatchEvent(new CustomEvent("cookie-consent-accepted"));
    }
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-2xl rounded-2xl border border-border bg-popover/95 p-4 shadow-4 backdrop-blur supports-backdrop-filter:bg-popover/80 sm:inset-x-auto sm:right-4 sm:left-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2.5 text-sm text-muted-foreground">
          <Cookie className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>
            We use a few essential cookies to run the store, plus optional
            privacy-friendly analytics. See our{" "}
            <Link href="/legal/cookies" className="font-medium text-foreground underline underline-offset-2">
              Cookie Policy
            </Link>
            .
          </span>
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="ghost" size="sm" onClick={() => decide("declined")}>
            Decline
          </Button>
          <Button size="sm" onClick={() => decide("accepted")}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
