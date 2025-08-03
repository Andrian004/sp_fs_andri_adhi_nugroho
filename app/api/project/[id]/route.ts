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

  const params = await context.params;
  if (!params || !params.id) {
    return NextResponse.json(
      { message: "Project ID is required" },
      { status: 400 }
    );
  }

  const isEditor = await prisma.membership.findFirst({
    where: {
      projectId: params.id,
      userId: request.auth.user.id,
    },
  });

  if (!isEditor) {
    return NextResponse.json(
      { message: "You do not have access to this project!" },
      { status: 403 }
    );
  }

  try {
    const project = await prisma.project.findUnique({
      where: {
        id: params.id,
        OR: [
          { ownerId: request.auth.user.id },
          {
            memberships: {
              some: { userId: request.auth.user.id },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        imageFullUrl: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: { name: true, email: true, image: true },
        },
      },
    });

    return NextResponse.json(
      { message: "Projects fetched successfully.", body: project },
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
      { message: "Project ID is required" },
      { status: 400 }
    );
  }

  const projectId = params.id;

  const isOwner = await prisma.project.findUnique({
    where: { id: projectId, ownerId: request.auth.user.id },
  });

  if (!isOwner) {
    return NextResponse.json(
      { message: "Only the owner can delete this project!" },
      { status: 403 }
    );
  }

  try {
    await prisma.project.delete({
      where: { id: projectId },
    });

    return NextResponse.json({ message: "Project successfully deleted!" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project!" },
      { status: 500 }
    );
  }
}) as NextAuthAPIRouteHandler;
