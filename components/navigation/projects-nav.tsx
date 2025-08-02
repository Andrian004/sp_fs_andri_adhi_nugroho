"use client";

import { ArrowLeft, ChevronsUpDown } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { projects } from "@/constant/projects";
import Link from "next/link";

export function ProjectsNav({
  project,
}: {
  project: { id: string; imageThumbUrl: string; title: string } | undefined;
}) {
  const { isMobile } = useSidebar();

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
                  <AvatarImage
                    src=""
                    alt={project.title ? project.title : ""}
                  />
                  <AvatarFallback className="rounded-lg">
                    {project.title[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight truncate font-semibold">
                  {project.title}
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              {projects &&
                projects.map((project) => (
                  <DropdownMenuItem key={project.id}>
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="size-6 rounded-md">
                        <AvatarImage
                          src=""
                          alt={project.title ? project.title : ""}
                        />
                        <AvatarFallback className="rounded-lg">
                          {project.title[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight truncate font-semibold">
                        {project.title}
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                href="/dashboard"
                className="w-full flex items-center gap-2"
              >
                <span>
                  <ArrowLeft className="size-4" />
                </span>
                <span>Back to Dashboard</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
