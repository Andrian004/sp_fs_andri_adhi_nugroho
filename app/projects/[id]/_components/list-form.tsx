"use client";

import { useState, useRef, ComponentRef } from "react";
import { Plus } from "lucide-react";
import { ListWrapper } from "./list-wrapper";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { FormInput } from "@/components/form/form-input";
import { useParams, useRouter } from "next/navigation";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const ListForm = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const formRef = useRef<ComponentRef<"form">>(null);
  const inputRef = useRef<ComponentRef<"input">>(null);
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  const { mutate } = useMutation({
    mutationFn: async (data: { title: string; projectId: string }) => {
      const res = await fetch(`/api/list`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Failed to create list");
      }
      return res.json();
    },
    onSuccess: (data: { title: string }) => {
      toast({ title: `List "${data.title}" created` });
      queryClient.invalidateQueries({ queryKey: ["lists", params.id] });
      disableEditing();
      router.refresh();
    },
    onError: (error: Error) => {
      toast({ title: error.message, variant: "destructive" });
    },
  });

  useEventListener("keydown", onKeyDown);

  useOnClickOutside(formRef as React.RefObject<HTMLElement>, disableEditing);

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const projectId = formData.get("projectId") as string;

    mutate({
      title,
      projectId,
    });
  };

  if (isEditing) {
    return (
      <ListWrapper>
        <form
          action={onSubmit}
          ref={formRef}
          className="w-full bg-white text-black p-3 rounded-md space-y-4 shadow-md"
        >
          <FormInput
            ref={inputRef}
            id="title"
            className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition dark:bg-transparent"
            placeholder="Enter list title"
          />
          <input hidden defaultValue={params.id} name="projectId" />
          <div className="flex items-center gap-x-1">
            <FormSubmit>Add list</FormSubmit>
            <Button
              onClick={disableEditing}
              size="sm"
              variant="ghost"
              className="text-black"
            >
              Cancel
            </Button>
          </div>
        </form>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <button
        className="w-full rounded-md text-black bg-white/95 hover:bg-white/80 transition p-3 flex items-center justify-between font-medium text-sm"
        onClick={enableEditing}
      >
        Add a list
        <Plus className="w-4 h-4" />
      </button>
    </ListWrapper>
  );
};
