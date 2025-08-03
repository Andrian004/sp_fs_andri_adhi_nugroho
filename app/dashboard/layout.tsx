import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSideBar } from "@/components/bar/dashboard-sidebar";
import { Button } from "@/components/ui/button";
// import { FormPopover } from "@/components/form/form-popover";
import { CreateBoardModal } from "@/components/modals/create-board-modal";
import { Plus } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardSideBar />
      <div className="w-full">
        <header className="w-full sticky flex items-center justify-between p-3 bg-white border-b border-gray-200">
          <div className="flex gap-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">Your Projects</h1>
          </div>
          <CreateBoardModal>
            <Button className="bg-sky-500">
              <span className="hidden sm:inline">New Project</span>
              <span className="sm:hidden">
                <Plus />
              </span>
            </Button>
          </CreateBoardModal>
        </header>
        <main className="flex-grow p-4">{children}</main>
      </div>
    </SidebarProvider>
  );
}
