"use client";

import { FormSubmit } from "../form/form-submit";
import { FormInput } from "../form/form-input";
import { FormPicker } from "../form/form-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CreateBoardModalProps {
  children: React.ReactNode;
  className?: string;
}

export const CreateBoardModal = ({
  children,
  className,
}: CreateBoardModalProps) => {
  // const proModal = useProModal();
  // const router = useRouter();
  // const closeRef = useRef<ComponentRef<"button">>(null);

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const image = formData.get("image") as string;

    console.log({ title, image });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={className}>
        <DialogHeader>
          <div className="text-sm font-medium text-center text-neutral-600 pb-4">
            Create New Project
          </div>
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
