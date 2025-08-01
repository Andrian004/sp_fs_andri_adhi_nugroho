import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SideBar } from "@/components/admin-sidebar";
import { Button } from "@/components/ui/button";
// import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SideBar />
      <div className="w-full">
        <header className="w-full sticky flex items-center justify-between p-3 bg-white border-b border-gray-200">
          <div className="flex gap-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">Overview</h1>
          </div>
          <Button className="bg-sky-500">New Project</Button>
        </header>
        <main className="flex-grow p-4">{children}</main>
      </div>
    </SidebarProvider>
  );
}
