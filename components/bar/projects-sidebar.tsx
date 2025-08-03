"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ProjectsNav } from "@/components/navigation/projects-nav";
import { UserNav } from "@/components/navigation/user-nav";
import { ProjectSideNav } from "@/components/navigation/project-side-nav";
import { useSession } from "next-auth/react";
import { ProjectWithImage } from "@/types";

export function ProjectsSideBar({ project }: { project: ProjectWithImage }) {
  const session = useSession();
  return (
    <Sidebar>
      <SidebarHeader>
        <ProjectsNav project={project} />
      </SidebarHeader>
      <SidebarContent>
        <ProjectSideNav />
      </SidebarContent>
      <SidebarFooter>
        <UserNav user={session.data?.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
