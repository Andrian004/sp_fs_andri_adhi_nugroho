"use client";

import { ComponentRef, useRef, useState } from "react";
import { CardWithList } from "@/types";
import { AlignLeft } from "lucide-react";
// import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { Skeleton } from "@/components/ui/skeleton";
import { FormTextarea } from "@/components/form/form-textarea";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DescriptionProps {
  data: CardWithList;
}

export const Description = ({ data }: DescriptionProps) => {
  // const params = useParams();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const textAreaRef = useRef<ComponentRef<"textarea">>(null);
  const formRef = useRef<ComponentRef<"form">>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textAreaRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") disableEditing();
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef as React.RefObject<HTMLElement>, disableEditing);

  const { mutate } = useMutation({
    mutationFn: async (data: {
      description: string;
      title: string;
      id: string;
    }) => {
      const res = await fetch(`/api/card`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Failed to update card description");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["task", data.id],
      });

      toast({ title: `Card description updated!` });
      disableEditing();
    },
    onError: (error: Error) => {
      toast({ title: error.message, variant: "destructive" });
    },
  });

  const onSubmit = (formData: FormData) => {
    const description = formData.get("description") as string;

    mutate({ description, title: data.title, id: data.id });
  };

  return (
    <div className="w-full flex items-start gap-x-3">
      <AlignLeft className="w-5 h-5 mt-0.5 text-neutral-700 dark:text-neutral-400" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 dark:text-neutral-400 mb-2">
          Description
        </p>
        {isEditing ? (
          <form action={onSubmit} ref={formRef} className="space-y-2">
            <FormTextarea
              id="description"
              ref={textAreaRef}
              className="w-full  mt-2"
              placeholder="Add more description..."
              defaultValue={data.description || undefined}
            />
            <div className="flex items-center gap-x-2">
              <FormSubmit>Save</FormSubmit>
              <Button
                type="button"
                variant="ghost"
                onClick={disableEditing}
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            role="button"
            onClick={enableEditing}
            className="min-h-[78px] bg-neutral-200 dark:text-neutral-800 text-sm font-medium py-3 px-3.5  rounded-md"
          >
            {data.description || "Add more description..."}
          </div>
        )}
      </div>
    </div>
  );
};

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="w-full flex items-start gap-x-3">
      <Skeleton className="w-6 h-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-[78px] bg-neutral-200" />
      </div>
    </div>
  );
};
