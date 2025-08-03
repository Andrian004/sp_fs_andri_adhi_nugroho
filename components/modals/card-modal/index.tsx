"use client";

import { useCardModal } from "@/hooks/use-card-modal";
import { CardWithList, SuccesResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Header } from "./header";
import { Description } from "./description";
import { Actions } from "./actions";
import { Assignment } from "./assignment";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export const CardModal = () => {
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  const onClose = useCardModal((state) => state.onClose);

  const { data: cardData } = useQuery<SuccesResponse<CardWithList>>({
    queryKey: ["task", id],
    queryFn: async () => {
      const res = await fetch(`/api/card/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch card data");
      }
      return res.json();
    },
    enabled: isOpen,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogTitle>
          {!cardData ? <Header.Skeleton /> : <Header data={cardData.body} />}
        </DialogTitle>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              {!cardData ? (
                <Description.Skeleton />
              ) : (
                <Description data={cardData.body} />
              )}
              {!cardData ? (
                <Assignment.Skeleton />
              ) : (
                <Assignment data={cardData.body} />
              )}
            </div>
          </div>
          <div className="space-y-6">
            {!cardData ? (
              <Actions.Skeleton />
            ) : (
              <Actions data={cardData.body} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
