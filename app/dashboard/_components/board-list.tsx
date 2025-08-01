import Link from "next/link";
import { Plus, User2 } from "lucide-react";
import { FormPopover } from "@/components/form/form-popover";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateBoardModal } from "@/components/modals/create-board-modal";
import { projects } from "@/constant/projects"; // Assuming you have a projects data file

export const BoardList = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-lg text-neutral-700 dark:text-neutral-400">
        <User2 className="w-6 h-6 mr-2" />
        Your projects
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm w-full h-full p-2 overflow-hidden"
            style={{ backgroundImage: `url(${project.imageThumbUrl})` }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
            <p className="relative font-semibold text-white">{project.title}</p>
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
    </div>
  );
};

BoardList.Skeleton = function SkeletonBoardList() {
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
};
