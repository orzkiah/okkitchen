"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AdminSidebar } from "./admin-sidebar";
import { Button } from "@/components/ui/button";

export function AdminMobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  // Close drawer whenever the route changes.
  React.useEffect(() => setOpen(false), [pathname]);

  // Lock body scroll while open.
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Menu admin"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-5" />
      </Button>

      {open && (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-64 flex-col border-r bg-card shadow-soft">
            <div className="flex shrink-0 justify-end p-2">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Tutup"
                onClick={() => setOpen(false)}
              >
                <X className="size-5" />
              </Button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <AdminSidebar />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
