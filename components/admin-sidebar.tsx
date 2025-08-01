import Link from "next/link";
import { auth } from "@/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserNav } from "@/components/navigation/user-nav";
import { DashboardNav } from "@/components/navigation/dashboard-nav";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export async function SideBar() {
  const session = await auth();
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div>
                <Link href="/">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="" alt="logo" />
                    <AvatarFallback className="rounded-lg">WP</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-oxfordblue font-semibold">
                    Dashboard
                  </span>
                  <span className="truncate text-xs">Mega</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <DashboardNav />
      </SidebarContent>
      <SidebarFooter>
        <UserNav user={session?.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
