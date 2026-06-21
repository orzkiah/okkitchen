"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExportButtons() {
  return (
    <div className="flex gap-2 print:hidden">
      <Button variant="outline" size="sm" asChild>
        <a href="/api/admin/reports/export?type=daily" download>
          <Download className="size-4" /> Harian (Excel)
        </a>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a href="/api/admin/reports/export?type=monthly" download>
          <Download className="size-4" /> Bulanan (Excel)
        </a>
      </Button>
    </div>
  );
}
