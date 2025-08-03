import { auth, NextAuthAPIRouteHandler } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type CardOrderData = {
  projectId: string;
  items: {
    id: string;
    title: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    listId: string;
  }[];
};

export const PUT = auth(async function PUT(request) {
  if (!request.auth || !request.auth.user)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  let updatedTasks;

  try {
    const data = await request.json();
    const { items }: CardOrderData = data;

    const transaction = items.map((task) =>
      prisma.task.update({
        where: {
          id: task.id,
          list: {
            project: {
              OR: [
                { ownerId: request.auth?.user?.id },
                { memberships: { some: { userId: request.auth?.user?.id } } },
              ],
            },
          },
        },
        data: {
          order: task.order,
          listId: task.listId,
        },
      })
    );

    updatedTasks = await prisma.$transaction(transaction);

    return NextResponse.json(
      { message: "Task updated successfully.", body: updatedTasks },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return new Response(error.message, { status: 500 });
    return new Response("Internal Server Error", { status: 500 });
  }
}) as NextAuthAPIRouteHandler;
