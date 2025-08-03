import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth, NextAuthAPIRouteHandler } from "@/auth";

type ProtectedApiParams = {
  params?: {
    id?: string;
  };
};

export const POST = auth(async function POST(
  request,
  context: ProtectedApiParams
) {
  if (!request.auth || !request.auth.user)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const params = await context.params;
  if (!params || !params.id) {
    return NextResponse.json(
      { message: "List ID is required" },
      { status: 400 }
    );
  }

  const currentUserId = request.auth.user.id;
  const taskId = params.id;
  const body = await request.json();

  const schema = z.object({
    userId: z.string().uuid().nullable(),
  });

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  const { userId } = parsed.data;

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      list: {
        select: {
          projectId: true,
        },
      },
    },
  });

  if (!task) {
    return NextResponse.json({ message: "Task not found!" }, { status: 404 });
  }

  const projectId = task.list.projectId;

  const isEditor = await prisma.membership.findFirst({
    where: {
      projectId,
      userId: currentUserId,
    },
  });

  if (!isEditor) {
    return NextResponse.json(
      { message: "You do not have access to this project!" },
      { status: 403 }
    );
  }

  if (userId) {
    const targetUser = await prisma.membership.findFirst({
      where: {
        projectId,
        userId,
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        {
          message:
            "The user you wish to assign is not a member of this project.",
        },
        { status: 400 }
      );
    }
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      assigneeId: userId,
    },
  });

  return NextResponse.json({
    message: userId
      ? "Task successfully assigned."
      : "The task was successfully removed from the assignment.",
    body: updatedTask,
  });
}) as NextAuthAPIRouteHandler;
