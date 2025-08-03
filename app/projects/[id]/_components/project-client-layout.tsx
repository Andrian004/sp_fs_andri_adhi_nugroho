"use client";

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ProjectWithImage, SuccesResponse } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ProjectsSideBar } from "@/components/bar/projects-sidebar";

import Link from "next/link";

export function ProjectsClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const projectQuery: UseQueryResult<SuccesResponse<ProjectWithImage>> =
    useQuery({
      queryKey: ["project", params.id],
      queryFn: async () => {
        const response = await fetch(`/api/project/${params.id}`);
        if (response.status === 403) {
          router.push("/dashboard");
          throw new Error("Forbidden");
        }
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        console.log(data);
        return data;
      },
    });

  if (projectQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (projectQuery.isError || !projectQuery.data) {
    return <div>Failed to fetch projects!</div>;
  }

  return (
    <>
      <ProjectsSideBar project={projectQuery.data.body} />
      <div className="w-full overflow-hidden">
        <div
          className="relative w-full h-full bg-no-repeat bg-cover bg-center"
          style={{
            backgroundImage: `url(${projectQuery.data.body.imageFullUrl})`,
          }}
        >
          <header className="w-full absolute top-0 left-0 z-10 flex items-center justify-between p-3 bg-white border-b border-gray-200">
            <div className="flex gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">
                {projectQuery.data.body.name}
              </h1>
            </div>
            <Link
              href="/dashboard"
              className="bg-indigo-700 text-white px-3 py-2 rounded-md"
            >
              Dashboard
            </Link>
          </header>
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative h-full">{children}</div>
        </div>
      </div>
    </>
  );
}
