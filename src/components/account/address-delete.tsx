"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteAddress } from "@/features/account/actions";

export function AddressDelete({ id }: { id: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      aria-label="Delete address"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await deleteAddress(id);
          toast.success("Address removed.");
          router.refresh();
        })
      }
      className="text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
    </button>
  );
}
