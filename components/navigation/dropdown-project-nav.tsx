"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Project, SuccesResponse } from "@/types";
import { useSidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function DropdownProjectNav() {
  const params = useParams<{ id: string }>();
  const { isMobile } = useSidebar();

  const projectsQuery: UseQueryResult<SuccesResponse<Project[]>> = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch("/api/project?limit=10&page=1");
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      return data;
    },
  });

  return (
    <DropdownMenuContent
      className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg mt-2"
      side={isMobile ? "bottom" : "right"}
      align="end"
      sideOffset={4}
    >
      <DropdownMenuGroup>
        {projectsQuery.isLoading && (
          <DropdownMenuItem>
            <div className="text-center">
              <LoaderCircle className="size-4 animate-spin" />
            </div>
          </DropdownMenuItem>
        )}
        {projectsQuery.data &&
          projectsQuery.data.body
            .filter((p) => p.id !== params.id)
            .map((project) => (
              <DropdownMenuItem key={project.id}>
                <Link
                  href={`/projects/${project.id}`}
                  className="w-full h-full flex items-center gap-2 p-1 text-left text-sm"
                >
                  <Avatar className="size-6 rounded-md">
                    <AvatarImage
                      src=""
                      alt={project.name ? project.name : ""}
                    />
                    <AvatarFallback className="rounded-lg">
                      {project.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight truncate font-semibold">
                    {project.name}
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <Link href="/dashboard" className="w-full flex items-center gap-2">
          <span>
            <ArrowLeft className="size-4" />
          </span>
          <span>Back to Dashboard</span>
        </Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
