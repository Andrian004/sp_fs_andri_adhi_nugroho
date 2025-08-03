"use client";

import { FormSubmit } from "../form/form-submit";
import { FormInput } from "../form/form-input";
import { FormPicker } from "../form/form-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

interface CreateBoardModalProps {
  children: React.ReactNode;
  className?: string;
}

export const CreateBoardModal = ({
  children,
  className,
}: CreateBoardModalProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const createProject = useMutation({
    mutationFn: async (data: {
      title: string;
      image: string;
      ownerId: string;
    }) => {
      const response = await fetch("/api/project", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to create project");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setOpen(false);
      toast({
        title: "Success",
        description: "Project created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const image = formData.get("image") as string;

    if (!title || !image) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create a project.",
        variant: "destructive",
      });
      return;
    }

    createProject.mutate({
      title,
      image,
      ownerId: session.user.id,
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={cn("max-w-lg", className)}>
        <DialogHeader>
          <DialogTitle>
            <div className="text-sm font-medium text-center text-neutral-600 pb-4">
              Create New Project
            </div>
          </DialogTitle>
        </DialogHeader>
        <form action={onSubmit} className="space-y-4">
          <div className="space-y-4">
            <FormPicker id="image" />
            <FormInput id="title" label="Name" type="text" />
          </div>
          <FormSubmit className="w-full">Create</FormSubmit>
        </form>
      </DialogContent>
    </Dialog>
  );
};
