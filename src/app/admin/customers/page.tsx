import { Users } from "lucide-react";
import { getCustomers } from "@/server/services/customer-admin.service";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { formatRupiah, formatDate } from "@/lib/utils";

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Manajemen Pelanggan</h1>

      {customers.length === 0 ? (
        <EmptyState icon={Users} title="Belum ada pelanggan" />
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="p-4 font-medium">Pelanggan</th>
                  <th className="p-4 font-medium">WhatsApp</th>
                  <th className="p-4 font-medium">Pesanan</th>
                  <th className="p-4 font-medium">Total Belanja</th>
                  <th className="p-4 font-medium">Bergabung</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-b last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          {c.image && <AvatarImage src={c.image} alt={c.name} />}
                          <AvatarFallback>{c.name[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{c.whatsapp ?? "-"}</td>
                    <td className="p-4">{c.orderCount}</td>
                    <td className="p-4 font-semibold">{formatRupiah(c.totalSpent)}</td>
                    <td className="p-4 text-muted-foreground">{formatDate(c.joinedAt)}</td>
                    <td className="p-4">
                      <Badge variant={c.totalSpent > 0 ? "success" : "outline"}>
                        {c.totalSpent > 0 ? "Aktif" : "Baru"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
