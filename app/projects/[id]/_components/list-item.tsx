"use client";

import { ComponentRef, useRef, useState } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { ListWithCards } from "@/types";
import { ListHeader } from "./list-header";
import { CardForm } from "./card-form";
import { cn } from "@/lib/utils";
import { CardItem } from "./card-item";

interface ListItemProps {
  index: number;
  data: ListWithCards;
}

export const ListItem = ({ index, data }: ListItemProps) => {
  const textareaRef = useRef<ComponentRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enaableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="shrink-0 w-[280px] h-full select-none"
        >
          <div
            className="w-full rounded-md shadow-md pb-2 px-2"
            style={{
              backgroundColor: data.backgroundColor || "#ffffff",
            }}
          >
            <div {...provided.dragHandleProps}>
              <ListHeader onAddCard={enaableEditing} data={data} />
            </div>
            <div className="bg-[#f1f2f4] rounded-md">
              <Droppable droppableId={data.id} type="card">
                {(provided) => (
                  <ol
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "mx-1 py-1 flex flex-col gap-y-2",
                      data.task.length > 0 ? "mt-2" : "mt-0"
                    )}
                  >
                    {data.task.map((task, index) => (
                      <CardItem key={task.id} index={index} data={task} />
                    ))}
                    {provided.placeholder}
                  </ol>
                )}
              </Droppable>

              <CardForm
                listId={data.id}
                ref={textareaRef}
                isEditing={isEditing}
                enableEditing={enaableEditing}
                disableEditing={disableEditing}
              />
            </div>
          </div>
        </li>
      )}
    </Draggable>
  );
};
