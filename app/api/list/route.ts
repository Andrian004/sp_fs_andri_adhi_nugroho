import { auth, NextAuthAPIRouteHandler } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = auth(async function POST(request) {
  if (!request.auth || !request.auth.user)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  try {
    const data = await request.json();
    const { title, projectId } = data;

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        OR: [
          { ownerId: request.auth.user.id },
          { memberships: { some: { userId: request.auth.user.id } } },
        ],
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found." },
        { status: 404 }
      );
    }

    const lastList = await prisma.list.findFirst({
      where: { projectId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastList ? lastList.order + 1 : 1;
    const list = await prisma.list.create({
      data: {
        title,
        projectId,
        order: newOrder,
      },
    });

    return Response.json(
      { message: "List created successfully.", body: list },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error)
      return new Response(error.message, { status: 500 });
    return new Response("Internal Server Error", { status: 500 });
  }
}) as NextAuthAPIRouteHandler;

export const GET = auth(async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const projectId = searchParams.get("projectId");

  if (!request.auth || !request.auth.user)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  if (!projectId) {
    return NextResponse.json(
      { message: "Project ID is required" },
      { status: 400 }
    );
  }

  try {
    const list = await prisma.list.findMany({
      where: {
        projectId: projectId,
      },
      include: {
        task: {
          orderBy: {
            order: "asc",
          },
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json(
      { message: "Projects fetched successfully.", body: list },
      { status: 200 }
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
    const { id, title, projectId, textColor, backgroundColor } = data;

    const list = await prisma.list.update({
      where: {
        id,
        projectId,
        project: {
          OR: [
            { ownerId: request.auth.user.id },
            { memberships: { some: { userId: request.auth.user.id } } },
          ],
        },
      },
      data: {
        title,
        textColor,
        backgroundColor,
      },
    });

    return NextResponse.json(
      { message: "List updated successfully.", body: list },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return new Response(error.message, { status: 500 });
    return new Response("Internal Server Error", { status: 500 });
  }
}) as NextAuthAPIRouteHandler;
