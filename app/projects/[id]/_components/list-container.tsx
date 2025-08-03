"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { ListWithCards } from "@/types";
import { ListForm } from "./list-form";
import { ListItem } from "./list-item";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

interface ListContainerProps {
  projectId: string;
  data: ListWithCards[];
}

type ListOrderData = {
  items: {
    id: string;
    title: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
  projectId: string;
};

type CardOrderData = {
  items: {
    id: string;
    title: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    listId: string;
  }[];
};

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export const ListContainer = ({ projectId, data }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);
  const { toast } = useToast();

  const { mutate: execUpdateListOrder } = useMutation({
    mutationFn: (data: ListOrderData) => {
      return fetch(`/api/list/order`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({ title: "List reordered!" });
    },
    onError: (error: Error) => {
      toast({ title: error.message, variant: "destructive" });
    },
  });

  const { mutate: execUpdateCardOrder } = useMutation({
    mutationFn: (data: CardOrderData) => {
      return fetch(`/api/card/order`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({ title: "Task reordered!" });
    },
    onError: (error: Error) => {
      toast({ title: error.message, variant: "destructive" });
    },
  });

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) return;

    // if dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // user move a list
    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      );

      setOrderedData(items);
      execUpdateListOrder({ items, projectId });
    }

    // user move a task
    if (type === "card") {
      const newOrderedData = [...orderedData];

      // source and destination list
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );
      const destList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destList) return;

      // check if task exists on the sourceList
      if (!sourceList.task) {
        sourceList.task = [];
      }

      // check if task exists on the destList
      if (!destList.task) {
        sourceList.task = [];
      }

      // moving the task in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.task,
          source.index,
          destination.index
        );

        reorderedCards.forEach((card, i) => {
          card.order = i;
        });

        sourceList.task = reorderedCards;
        setOrderedData(newOrderedData);
        execUpdateCardOrder({ items: reorderedCards });

        // user move task to another list
      } else {
        // remove task from the source list
        const [movedCard] = sourceList.task.splice(source.index, 1);

        // assign the new listId to the moved task
        movedCard.listId = destination.droppableId;

        // add the task to the destination list
        destList.task.splice(destination.index, 0, movedCard);

        sourceList.task.forEach((task, i) => (task.order = i));

        // update the order forEach task in the destination list
        destList.task.forEach((task, i) => (task.order = i));

        setOrderedData(newOrderedData);
        execUpdateCardOrder({ items: destList.task });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, index) => {
              return <ListItem key={list.id} index={index} data={list} />;
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
