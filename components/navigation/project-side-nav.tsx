"use client";

import Link from "next/link";
import { ChartNoAxesColumn, LayoutGrid, Settings } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Menu items.
const items = [
  {
    title: "Board",
    url: "",
    icon: LayoutGrid,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Activity",
    url: "/activity",
    icon: ChartNoAxesColumn,
  },
];

export function ProjectSideNav() {
  const pathname = usePathname();
  const params = useParams<{ id: string }>();
  const mainUrl = `/projects/${params.id}`;

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
                  pathname === mainUrl + item.url && "bg-indigo-100"
                )}
              >
                <Link href={mainUrl + item.url} className="font-medium">
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
