"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { CardWithList, Member, SuccesResponse } from "@/types";
import { Loader2, Minus, Plus, UserPlus2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Hint } from "@/components/hint";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AssignmentProps {
  data: CardWithList;
}

export const Assignment = ({ data }: AssignmentProps) => {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const membersQuery = useQuery<SuccesResponse<Member[]>>({
    queryKey: ["members", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/project/${params.id}/members`);
      if (!res.ok) throw new Error("Failed to load members");
      const result = await res.json();
      return result;
    },
  });

  // add assigned user
  const { mutate: execUpdateAsigned, isPending: updateLoading } = useMutation({
    mutationFn: async (data: { taskId: string; memberId: string | null }) => {
      const res = await fetch(`/api/card/${data.taskId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: data.memberId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to assign task!");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["task", data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["lists", params.id],
      });

      toast({ title: "Task updated!" });
      setIsOpen(false);
    },
    onError: (error) => {
      toast({ title: error.message, variant: "destructive" });
    },
  });

  // execute add assigned user
  const onAssign = (memberId: string) => {
    const taskId = data.id;
    // const boardId = params.id;
    console.log(memberId);
    execUpdateAsigned({ memberId, taskId });
  };

  // execute delete assigned user
  const onDeleteAssign = () => {
    const taskId = data.id;
    // const boardId = params.id;
    execUpdateAsigned({ memberId: null, taskId });
  };

  return (
    <div className="space-y-2 mt-2">
      <p className="text-sm font-semibold">Assignment</p>
      {data.assignee ? (
        <div
          role="button"
          className="w-full flex justify-start items-center max-h-min py-1.5 text-sm font-medium cursor-pointer bg-neutral-200 px-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <div className="flex items-center gap-x-2 w-full">
            <Avatar className="w-5 h-5 mr-2">
              <AvatarImage src={data.assignee.image} />
              <AvatarFallback>
                {data.assignee.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="truncate">{data.assignee.name}</p>
          </div>
          <Hint
            description="Remove assigned person"
            align="end"
            sideOffset={10}
          >
            <Button
              size="xs"
              variant="ghost"
              onClick={() => onDeleteAssign()}
              disabled={updateLoading}
              className="h-5"
              asChild
            >
              <Minus className="w-4 h-4" />
            </Button>
          </Hint>
        </div>
      ) : (
        <Button
          variant="secondary"
          className="w-full justify-start text-neutral-600 bg-neutral-200 hover:text-black dark:hover:text-white"
          size="inline"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <UserPlus2 className="w-4 h-4 mr-2" />
          Add
        </Button>
      )}
      <div
        className={cn(
          "space-y-2 p-2 w-full bg-neutral-400 rounded-sm",
          !isOpen && "hidden"
        )}
      >
        {!membersQuery.data && membersQuery.isLoading ? (
          <div className="flex justify-center items-center w-full">
            <Loader2 className="h-6 w-6 text-sky-700 animate-spin" />
          </div>
        ) : (
          membersQuery.data?.body.map((membership) => (
            <Button
              key={membership.id}
              size="inline"
              className="w-full justify-between bg-white text-black border hover:bg-neutral-100"
              onClick={() => onAssign(membership.id)}
              disabled={updateLoading}
            >
              <div className="flex">
                <Avatar className="w-5 h-5 mr-2">
                  <AvatarImage src={membership.image} />
                  <AvatarFallback>
                    {membership.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="truncate">{membership.name}</p>
              </div>
              <Plus />
            </Button>
          ))
        )}
      </div>
    </div>
  );
};

Assignment.Skeleton = function AssignmentSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  );
};
