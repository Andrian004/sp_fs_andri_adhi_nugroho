"use client";

import { useState, useRef, ComponentRef } from "react";
import { List } from "@prisma/client";
import { useEventListener } from "usehooks-ts";
import { FormInput } from "@/components/form/form-input";
import { ListOptions } from "./list-options";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ListHeaderProps {
  onAddCard: () => void;
  data: List;
}

export const ListHeader = ({ onAddCard, data }: ListHeaderProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState<string>(data.title);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const formRef = useRef<ComponentRef<"form">>(null);
  const inputRef = useRef<ComponentRef<"input">>(null);

  const enableEditing = () => {
    setIsEditing(true);

    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      formRef.current?.requestSubmit();
    }
  };

  const { mutate } = useMutation({
    mutationFn: async (data: {
      id: string;
      title: string;
      projectId: string;
      textColor: string;
      backgroundColor: string;
    }) => {
      const res = await fetch(`/api/list`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Failed to update list");
      }
      const result = res.json();
      setTitle(data.title);
      return result;
    },
    onSuccess: () => {
      toast({ title: `Renamed title` });
      disableEditing();
    },
    onError: (error: Error) => {
      toast({ title: error.message, variant: "destructive" });
    },
  });

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const id = formData.get("id") as string;
    const projectId = formData.get("projectId") as string;

    if (title.length < 3) {
      toast({ title: "Title is to short" });
      return;
    }
    if (title === data.title) return disableEditing();

    mutate({
      title,
      id: id,
      projectId: projectId,
      textColor: data.textColor || "#000000",
      backgroundColor: data.backgroundColor || "#FFFFFF",
    });
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  useEventListener("keydown", onKeydown);

  return (
    <div className="flex justify-between items-start gap-x-2 text-sm font-semibold pt-2 px-2">
      {isEditing ? (
        <form ref={formRef} action={onSubmit} className="flex-1 px-[2px]">
          <input hidden id="id" name="id" defaultValue={data.id} />
          <input
            hidden
            id="projectId"
            name="projectId"
            defaultValue={data.projectId}
          />
          <FormInput
            ref={inputRef}
            id="title"
            onBlur={onBlur}
            placeholder="Enter list title"
            defaultValue={title}
            className="h-7 text-sm px-[7px] py-1 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white dark:focus:bg-neutral-600"
          />
          <button type="submit" hidden />
        </form>
      ) : (
        <div
          onClick={enableEditing}
          className="w-full h-7 text-sm font-medium px-2.5 py-1 border-transparent"
          style={{ color: data.textColor || "#000000" }}
        >
          {title}
        </div>
      )}
      <ListOptions onAddCard={onAddCard} data={data} />
    </div>
  );
};
