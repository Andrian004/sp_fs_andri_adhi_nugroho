"use client";

import { Draggable } from "@hello-pangea/dnd";
import { useCardModal } from "@/hooks/use-card-modal";
import { TaskWithAssignee } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CardItemProps {
  index: number;
  data: TaskWithAssignee;
}

export const CardItem = ({ index, data }: CardItemProps) => {
  const cardModal = useCardModal();

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          role="button"
          onClick={() => cardModal.onOpen(data.id)}
          className="flex justify-between gap-x-1 truncate border-2 border-transparent hover:border-black py-2 px-2 text-sm bg-white text-black rounded-md shadow-sm"
        >
          {data.assignee ? (
            <Avatar className="w-5 h-5 mr-1">
              <AvatarImage src={data.assignee.image} />
              <AvatarFallback>
                {data.assignee.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : null}
          <p className="w-full truncate">{data.title}</p>
          <div
            {...provided.dragHandleProps}
            className="cursor-move text-gray-600"
          >
            ⠿
          </div>
        </div>
      )}
    </Draggable>
  );
};
