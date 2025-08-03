"use client";

import { ChevronsUpDown } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ProjectWithImage } from "@/types";
import { DropdownProjectNav } from "./dropdown-project-nav";

export function ProjectsNav({ project }: { project: ProjectWithImage }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {project && (
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="size-6 rounded-md">
                  <AvatarImage src="" alt={project.name ? project.name : ""} />
                  <AvatarFallback className="rounded-lg">
                    {project.name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight truncate font-semibold">
                  {project.name}
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            )}
          </DropdownMenuTrigger>
          <DropdownProjectNav />
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
