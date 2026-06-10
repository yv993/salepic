"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderStatus } from "@/features/orders/actions";
import {
  ORDER_STATUS_ORDER,
  ORDER_STATUS_META,
} from "@/features/orders/constants";
import type { OrderStatus } from "@/db/schema";

export function OrderStatusSelect({
  id,
  status,
}: {
  id: string;
  status: OrderStatus;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onChange(next: string | null) {
    if (!next || next === status) return;
    startTransition(async () => {
      const res = await updateOrderStatus(id, next as OrderStatus);
      if (!res.ok) {
        toast.error(res.error ?? "Couldn't update the order.");
        return;
      }
      toast.success(`Order marked ${ORDER_STATUS_META[next as OrderStatus].label.toLowerCase()}.`);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={status} onValueChange={onChange} disabled={pending}>
        <SelectTrigger size="sm" className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ORDER_STATUS_ORDER.map((s) => (
            <SelectItem key={s} value={s}>
              {ORDER_STATUS_META[s].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {pending && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
    </div>
  );
}
