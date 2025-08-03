"use client";

import { useParams } from "next/navigation";
import { Trash } from "lucide-react";
import { CardWithList } from "@/types";
import { useCardModal } from "@/hooks/use-card-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ActionsProps {
  data: CardWithList;
}

export const Actions = ({ data }: ActionsProps) => {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const cardModal = useCardModal();
  const { toast } = useToast();

  const { mutate: execDeleteCard, isPending: isLoadingDelete } = useMutation({
    mutationFn: (data: { id: string }) => {
      return fetch(`/api/card/${data.id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({ title: `Card deleted successfully!` });
      queryClient.invalidateQueries({ queryKey: ["lists", params.id] });
      cardModal.onClose();
    },
    onError: (error: Error) => {
      toast({ title: error.message, variant: "destructive" });
    },
  });

  const onDelete = () => {
    // const projectId = params.id;
    execDeleteCard({ id: data.id });
  };

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold">Actions</p>
      <Button
        onClick={onDelete}
        disabled={isLoadingDelete}
        className="w-full justify-start dark:text-neutral-900 hover:text-rose-500 dark:hover:text-rose-500"
      >
        <Trash className="w-4 h-4 mr-2" />
        Delete
      </Button>
    </div>
  );
};

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  );
};
