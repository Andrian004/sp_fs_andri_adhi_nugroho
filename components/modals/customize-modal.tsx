"use client";

import { useState } from "react";
import { List } from "@prisma/client";
import { FormSubmit } from "../form/form-submit";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Palette } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: List;
}

export const CustomizeModal = ({
  isOpen,
  onClose,
  data,
}: CustomizeModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const params = useParams<{ id: string }>();
  const [titleColor, setTitleColor] = useState<string>("#000000");
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");

  const { mutate, isPending } = useMutation({
    mutationKey: ["updateList"],
    mutationFn: async (data: {
      id: string;
      title: string;
      projectId: string;
      textColor: string;
      backgroundColor: string;
    }) => {
      const response = await fetch(`/api/list`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update list");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists", params.id] });
      toast({ title: `List updated!` });
      onClose();
    },
    onError: (error: Error) => {
      toast({ title: error.message });
    },
  });

  const onSubmit = (formData: FormData) => {
    const id = data.id as string;
    const title = data.title as string;
    const projectId = data.projectId as string;
    const textColor = formData.get("titleColor") as string;
    const backgroundColor = formData.get("bgColor") as string;

    mutate({ id, title, projectId, textColor, backgroundColor });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogTitle>
          <div className="w-full flex items-center">
            <Palette className="w-5 h-5 me-2" />
            <h1 className="font-semibold">Customize</h1>
          </div>
        </DialogTitle>
        <Separator />
        <div className="w-full">
          <div
            className="p-2 mb-4 text-center font-medium rounded-md border"
            style={{ backgroundColor: backgroundColor }}
          >
            <p style={{ color: titleColor }}>Preview</p>
          </div>
          <form action={onSubmit} className="w-full space-y-4">
            <div className="border rounded-md p-2 space-y-2">
              <p className="text-sm font-medium">Text :</p>
              <div className="flex gap-x-3 items-center">
                <Input
                  type="color"
                  name="titleColor"
                  id="titleColor"
                  className="w-6 h-6 p-0 m-0 border-none outline-none rounded-full"
                  defaultValue={titleColor}
                  onChange={(e) => setTitleColor(e.target.value)}
                />
                <p className="text-sm">{titleColor}</p>
              </div>
            </div>
            <div className="border rounded-md p-2 space-y-2">
              <p className="text-sm font-medium">Background :</p>
              <div className="flex gap-x-3 items-center">
                <Input
                  type="color"
                  name="bgColor"
                  id="bgColor"
                  className="w-6 h-6 p-0 m-0 border-none outline-none rounded-full"
                  defaultValue={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                />
                <p className="text-sm">{backgroundColor}</p>
              </div>
            </div>
            <div className="flex gap-x-2">
              <FormSubmit disabled={isPending}>Save</FormSubmit>
              <Button type="button" onClick={onClose} variant="ghost">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
