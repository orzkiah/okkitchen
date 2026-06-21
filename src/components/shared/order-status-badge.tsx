import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_LABEL } from "@/lib/constants";

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "accent" | "gold" | "success" | "destructive" | "outline"
> = {
  PENDING_PAYMENT: "gold",
  PROCESSING: "secondary",
  PACKING: "secondary",
  SHIPPED: "accent",
  COMPLETED: "success",
  CANCELLED: "destructive",
};

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={STATUS_VARIANT[status] ?? "outline"}>
      {ORDER_STATUS_LABEL[status] ?? status}
    </Badge>
  );
}
