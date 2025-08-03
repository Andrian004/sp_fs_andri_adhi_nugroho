import { auth, NextAuthAPIRouteHandler } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type ProtectedApiParams = {
  params?: {
    id?: string;
  };
};

export const GET = auth(async function GET(
  request,
  context: ProtectedApiParams
) {
  if (!request.auth || !request.auth.user)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  try {
    const params = await context.params;
    if (!params || !params.id) {
      return NextResponse.json(
        { message: "Project ID is required" },
        { status: 400 }
      );
    }

    const task = await prisma.task.findFirst({
      where: {
        id: params.id,
        list: {
          project: {
            OR: [
              { ownerId: request.auth.user.id },
              { memberships: { some: { userId: request.auth.user.id } } },
            ],
          },
        },
      },

      include: {
        assignee: { select: { id: true, name: true, image: true } },
        list: {
          select: {
            title: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Projects fetched successfully.", body: task },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return new Response(error.message, { status: 500 });
    return new Response("Internal Server Error", { status: 500 });
  }
}) as NextAuthAPIRouteHandler;

// DELETE
export const DELETE = auth(async function DELETE(
  request,
  context: ProtectedApiParams
) {
  if (!request.auth || !request.auth.user)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const params = await context.params;
  if (!params || !params.id) {
    return NextResponse.json(
      { message: "Task ID is required" },
      { status: 400 }
    );
  }

  const task = await prisma.task.delete({
    where: {
      id: params.id,
      list: {
        project: {
          OR: [
            { ownerId: request.auth.user.id },
            { memberships: { some: { userId: request.auth.user.id } } },
          ],
        },
      },
    },
  });

  return NextResponse.json(
    { message: "Task deleted successfully.", body: task },
    { status: 200 }
  );
}) as NextAuthAPIRouteHandler;
