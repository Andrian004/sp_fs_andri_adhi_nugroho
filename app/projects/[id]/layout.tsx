import { SidebarProvider } from "@/components/ui/sidebar";
import { ProjectsClientLayout } from "./_components/project-client-layout";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <ProjectsClientLayout>{children}</ProjectsClientLayout>
    </SidebarProvider>
  );
}
