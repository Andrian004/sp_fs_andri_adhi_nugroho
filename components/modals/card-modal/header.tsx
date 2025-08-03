"use client";

import { ComponentRef, useRef, useState } from "react";
// import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "lucide-react";
import { CardWithList } from "@/types";
import { FormInput } from "@/components/form/form-input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  data: CardWithList;
}

export const Header = ({ data }: HeaderProps) => {
  const queryClient = useQueryClient();
  // const params = useParams<{ id: string }>();
  const { toast } = useToast();

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
      const body = res.json();
      setTitle(data.title);
      return body;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["task", data.id],
      });
      toast({ title: `Title updated!` });
    },
    onError: (err) => toast({ title: err.message, variant: "destructive" }),
  });

  const inputRef = useRef<ComponentRef<"input">>(null);
  const [title, setTitle] = useState<string>(data.title);

  const onBlur = () => {
    inputRef.current?.form?.requestSubmit();
  };

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;

    if (title === data.title) return;

    mutate({
      title,
      description: data.description || "",
      id: data.id,
    });
  };

  return (
    <div className="w-full flex items-start gap-x-3">
      <Layout className="w-5 h-5 mt-1 text-neutral-700 dark:text-neutral-400" />
      <div className="w-full">
        <form action={onSubmit}>
          <FormInput
            ref={inputRef}
            onBlur={onBlur}
            id="title"
            defaultValue={title}
            className="font-semibold text-xl px-1 text-neutral-700 dark:text-neutral-400 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white dark:focus-visible:text-neutral-800 focus-visible:border-input mb-0.5 truncate shadow-none"
          />
        </form>
        <p className="text-xs text-muted-foreground">
          in list <span className="underline">{data.list.title}</span>
        </p>
      </div>
    </div>
  );
};

Header.Skeleton = function HeaderSkeleton() {
  return (
    <div className="flex items-start gap-x-3 mb-6">
      <Skeleton className="w-6 h-6 mt-1 bg-neutral-200" />
      <div>
        <Skeleton className="w-24 h-6 mb-1 bg-neutral-200" />
        <Skeleton className="w-12 h-4 bg-neutral-200" />
      </div>
    </div>
  );
};
