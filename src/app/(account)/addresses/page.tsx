import type { Metadata } from "next";
import { AddressManager } from "@/features/address/address-manager";

export const metadata: Metadata = { title: "Alamat" };

export default function AddressesPage() {
  return <AddressManager />;
}
