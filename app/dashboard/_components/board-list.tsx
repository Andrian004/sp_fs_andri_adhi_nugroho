"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { FormPopover } from "@/components/form/form-popover";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateBoardModal } from "@/components/modals/create-board-modal";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { SuccesResponse, Project } from "@/types";

export const BoardList = () => {
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
    <div className="space-y-4">
      {projectsQuery.isLoading ? (
        <SkeletonBoardList />
      ) : projectsQuery.error || !projectsQuery.data ? (
        <div>
          <p className="text-red-500">Failed to load projects.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {projectsQuery.data.body.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm w-full h-full p-2 overflow-hidden"
              style={{ backgroundImage: `url(${project.imageThumbUrl})` }}
            >
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
              <p className="relative font-semibold text-white">
                {project.name}
              </p>
            </Link>
          ))}
          <div className="sm:hidden">
            <CreateBoardModal className="rounded-md">
              <div
                role="button"
                className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col items-center justify-center gap-y-1 hover:opacity-75 transition"
              >
                <span>
                  <Plus />
                </span>
                <p className="text-sm">Create new Project</p>
              </div>
            </CreateBoardModal>
          </div>
          <div className="hidden sm:inline">
            <FormPopover sideOffset={10} side="right">
              <div
                role="button"
                className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col items-center justify-center gap-y-1 hover:opacity-75 transition"
              >
                <span>
                  <Plus />
                </span>
                <p className="text-sm">Create New Project</p>
              </div>
            </FormPopover>
          </div>
        </div>
      )}
    </div>
  );
};

function SkeletonBoardList() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <Skeleton className="aspect-video w-full h-full p-2" />
      <Skeleton className="aspect-video w-full h-full p-2" />
      <Skeleton className="aspect-video w-full h-full p-2" />
      <Skeleton className="aspect-video w-full h-full p-2" />
      <Skeleton className="aspect-video w-full h-full p-2" />
      <Skeleton className="aspect-video w-full h-full p-2" />
      <Skeleton className="aspect-video w-full h-full p-2" />
      <Skeleton className="aspect-video w-full h-full p-2" />
    </div>
  );
}
