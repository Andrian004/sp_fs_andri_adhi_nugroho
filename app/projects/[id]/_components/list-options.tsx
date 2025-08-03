"use client";

import { ComponentRef, useRef, useState } from "react";
import { List } from "@prisma/client";
import { MoreHorizontal, Palette, PlusSquare, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormSubmit } from "@/components/form/form-submit";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CustomizeModal } from "@/components/modals/customize-modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ListOptionsProps {
  onAddCard: () => void;
  data: List;
}

export const ListOptions = ({ onAddCard, data }: ListOptionsProps) => {
  const closeRef = useRef<ComponentRef<"button">>(null);
  const queryClient = useQueryClient();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const { toast } = useToast();

  const { mutate: executeDelete } = useMutation({
    mutationFn: async (data: { id: string; projectId: string }) => {
      return fetch(`/api/list/${data.id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists", data.projectId] });
      toast({ title: `List deleted successfully!` });
      closeRef.current?.click();
    },
    onError: (error: Error) => {
      toast({ title: error.message, variant: "destructive" });
    },
  });

  const onDelete = (formData: FormData) => {
    const id = formData.get("id") as string;
    const projectId = formData.get("projectId") as string;

    executeDelete({ id, projectId });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="w-auto h-auto p-2 hover:bg-neutral-100/25"
          variant="ghost"
        >
          <MoreHorizontal
            className="w-4 h-4"
            color={data.textColor || "#000000"}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="center">
        <div className="text-sm font-medium text-center text-neutral-600 dark:text-neutral-400 pb-4">
          List actions
        </div>
        <PopoverClose asChild>
          <Button
            ref={closeRef}
            className="w-auto h-auto absolute top-2 right-2 text-neutral-600 p-2"
            variant="ghost"
          >
            <X className="w-4 h-4" />
          </Button>
        </PopoverClose>
        <Button
          onClick={onAddCard}
          className="w-full h-auto justify-start font-normal text-sm rounded-none p-2 px-5"
          variant="ghost"
        >
          <PlusSquare className="w-4 h-4 me-2" />
          Add task...
        </Button>

        {/* custom list */}
        <Button
          onClick={() => setIsOpenModal(true)}
          className="w-full h-auto justify-start font-normal text-sm rounded-none p-2 px-5"
          variant="ghost"
        >
          <Palette className="w-4 h-4 me-2" />
          Customize
        </Button>
        <CustomizeModal
          isOpen={isOpenModal}
          onClose={() => setIsOpenModal(false)}
          data={data}
        />
        {/* custom list */}

        <Separator />
        <form action={onDelete}>
          <input hidden name="id" id="id" defaultValue={data.id} />
          <input
            hidden
            name="projectId"
            id="projectId"
            defaultValue={data.projectId}
          />
          <FormSubmit
            variant="ghost"
            className="w-full h-auto justify-start font-normal text-sm rounded-none p-2 px-5"
          >
            <Trash2 className="w-4 h-4 me-2" />
            Delete list
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};
