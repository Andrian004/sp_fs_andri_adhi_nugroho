"use client";

import { ComponentRef, KeyboardEventHandler, forwardRef, useRef } from "react";
import { Plus, X } from "lucide-react";
import { useParams } from "next/navigation";
import { FormSubmit } from "@/components/form/form-submit";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface CardFormProps {
  listId: string;
  isEditing: boolean;
  disableEditing: () => void;
  enableEditing: () => void;
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
  ({ listId, isEditing, disableEditing, enableEditing }, ref) => {
    const params = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const formRef = useRef<ComponentRef<"form">>(null);
    const { toast } = useToast();

    const { mutate } = useMutation({
      mutationFn: async (data: {
        title: string;
        listId: string;
        projectId: string;
      }) => {
        const res = await fetch(`/api/card`, {
          method: "POST",
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          throw new Error("Failed to create card");
        }
        return res.json();
      },
      onSuccess: () => {
        toast({ title: `New card created!` });
        queryClient.invalidateQueries({ queryKey: ["lists", params.id] });
        formRef.current?.reset();
      },
      onError: (error: Error) => {
        toast({ title: error.message, variant: "destructive" });
      },
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        disableEditing();
      }
    };

    useOnClickOutside(formRef as React.RefObject<HTMLElement>, disableEditing);
    useEventListener("keydown", onKeyDown);

    const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (
      e
    ) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };

    const onSubmit = (formData: FormData) => {
      const title = formData.get("title") as string;
      const listId = formData.get("listId") as string;
      const projectId = params.id as string;

      mutate({ title, listId, projectId });
    };

    if (isEditing) {
      return (
        <form
          ref={formRef}
          action={onSubmit}
          className="m-1 py-0.5 px-1 space-y-4"
        >
          <FormTextarea
            id="title"
            onKeyDown={onTextareaKeyDown}
            ref={ref}
            placeholder="Enter a title for this card..."
            className="dark:bg-white dark:text-black"
          />
          <input hidden id="listId" name="listId" defaultValue={listId} />
          <div className="flex items-center gap-x-1">
            <FormSubmit>Add task</FormSubmit>
            <Button
              onClick={disableEditing}
              size="sm"
              variant="ghost"
              className="dark:hover:bg-transparent dark:text-black"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </form>
      );
    }

    return (
      <div className="pt-2 px-2">
        <Button
          onClick={enableEditing}
          className="w-full h-auto justify-start text-muted-foreground text-sm px-2 py-1.5 dark:hover:bg-white/30 dark:hover:text-black/90"
          size="sm"
          variant="ghost"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add a task
        </Button>
      </div>
    );
  }
);

CardForm.displayName = "CardForm";
