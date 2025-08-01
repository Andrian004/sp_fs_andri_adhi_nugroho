"use client";

import Link from "next/link";
import {
  Home,
  CreditCard,
  Bell,
  LetterText,
  Database,
  ChartNoAxesCombined,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Menu items.
const items = [
  {
    title: "Overview",
    url: "/wp-admin",
    icon: Home,
  },
  {
    title: "Analitik",
    url: "/wp-admin/analytics",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Berita/Blog",
    url: "/wp-admin/blog",
    icon: LetterText,
  },
  {
    title: "Produk",
    url: "/wp-admin/product",
    icon: Database,
  },
  {
    title: "Pembayaran",
    url: "/wp-admin/billing",
    icon: CreditCard,
  },
  {
    title: "Notifikasi",
    url: "/wp-admin/notification",
    icon: Bell,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={cn(
                  "bg-transparent",
                  pathname === item.url && "bg-indigo-100"
                )}
              >
                <Link href={item.url} className="font-medium">
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
