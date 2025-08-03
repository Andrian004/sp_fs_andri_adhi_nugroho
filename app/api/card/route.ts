import { auth, NextAuthAPIRouteHandler } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = auth(async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const listId = searchParams.get("listId");

  if (!request.auth || !request.auth.user)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  if (!listId) {
    return NextResponse.json(
      { message: "Project ID is required" },
      { status: 400 }
    );
  }

  const task = await prisma.task.findMany({
    where: {
      listId,
    },
  });

  return NextResponse.json(
    { message: "Lists fetched successfully.", body: task },
    { status: 200 }
  );
}) as NextAuthAPIRouteHandler;

export const POST = auth(async function POST(request) {
  if (!request.auth || !request.auth.user)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  try {
    const data = await request.json();
    const { title, listId } = data;

    const list = await prisma.list.findUnique({
      where: {
        id: listId,
        project: {
          OR: [
            { ownerId: request.auth.user.id },
            { memberships: { some: { userId: request.auth.user.id } } },
          ],
        },
      },
    });

    if (!list) {
      return NextResponse.json({ message: "List not found." }, { status: 404 });
    }

    const lastCard = await prisma.task.findFirst({
      where: { listId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    const task = await prisma.task.create({
      data: {
        title,
        listId,
        order: newOrder,
      },
    });

    return Response.json(
      { message: "Project created successfully.", body: task },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error)
      return new Response(error.message, { status: 500 });
    return new Response("Internal Server Error", { status: 500 });
  }
}) as NextAuthAPIRouteHandler;

// PUT
export const PUT = auth(async function PUT(request) {
  if (!request.auth || !request.auth.user)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  try {
    const data = await request.json();
    const { id, title, description } = data;

    const task = await prisma.task.update({
      where: {
        id,
        list: {
          project: {
            OR: [
              { ownerId: request.auth.user.id },
              { memberships: { some: { userId: request.auth.user.id } } },
            ],
          },
        },
      },
      data: {
        title,
        description,
      },
    });

    return NextResponse.json(
      { message: "Task updated successfully.", body: task },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return new Response(error.message, { status: 500 });
    return new Response("Internal Server Error", { status: 500 });
  }
}) as NextAuthAPIRouteHandler;
