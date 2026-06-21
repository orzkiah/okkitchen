import { Skeleton } from "@/components/ui/skeleton";
import { ProductGridSkeleton } from "@/components/shared/product-card-skeleton";

export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Skeleton className="mb-2 h-8 w-48" />
      <Skeleton className="mb-6 h-4 w-64" />
      <div className="mb-6 flex gap-3">
        <Skeleton className="h-11 flex-1" />
        <Skeleton className="h-11 w-32" />
      </div>
      <ProductGridSkeleton count={8} />
    </div>
  );
}
