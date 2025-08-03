"use client";

import { ListWithCards, SuccesResponse } from "@/types";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ListContainer } from "./_components/list-container";
import { useParams } from "next/navigation";

export default function ProjectsPage() {
  const params = useParams<{ id: string }>();
  const listQuery: UseQueryResult<SuccesResponse<ListWithCards[]>> = useQuery({
    queryKey: ["lists", params.id],
    queryFn: async () => {
      const response = await fetch(`/api/list?projectId=${params.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      return data;
    },
  });

  return (
    <div className="h-full  pt-20 pb-4 px-4 overflow-x-auto">
      {listQuery.isLoading && <div>Loading...</div>}
      {listQuery.isError && <div>Error loading project!</div>}
      {listQuery.isSuccess && !listQuery.data.body && (
        <div>No project found!</div>
      )}
      {listQuery.isSuccess && listQuery.data.body && (
        <ListContainer projectId={params.id} data={listQuery.data.body} />
      )}
    </div>
  );
}
