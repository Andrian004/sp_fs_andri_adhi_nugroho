import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { auth, NextAuthAPIRouteHandler } from "@/auth";

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

  try {
    const memberships = await prisma.membership.findMany({
      where: { projectId: params.id },
      include: {
        user: true,
        project: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    const members = memberships.map((m) => ({
      id: m.userId,
      ownerId: m.project.ownerId,
      name: m.user.name,
      email: m.user.email,
      image: m.user.image,
      status: m.project.ownerId === m.userId ? "owner" : "member",
    }));

    return NextResponse.json({
      message: "Members fetched successfully!",
      body: members,
    });
  } catch (error) {
    if (error instanceof Error)
      return new Response(error.message, { status: 500 });
    return new Response("Internal Server Error", { status: 500 });
  }
}) as NextAuthAPIRouteHandler;

// POST
export const POST = auth(async function POST(
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

  const body = await request.json();
  const schema = z.object({ email: z.string().email() });
  const result = schema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "Invalid Email!" }, { status: 400 });
  }
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project || project.ownerId !== request.auth.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { email } = result.data;
    const projectId = params.id;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }

    const existing = await prisma.membership.findUnique({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "User is already a member!" },
        { status: 400 }
      );
    }

    await prisma.membership.create({
      data: {
        userId: user.id,
        projectId,
      },
    });

    return NextResponse.json({ message: "Successfully added members!" });
  } catch (error) {
    if (error instanceof Error)
      return new Response(error.message, { status: 500 });
    return new Response("Internal Server Error", { status: 500 });
  }
}) as NextAuthAPIRouteHandler;

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

  const body = await request.json();
  const schema = z.object({ userId: z.string().uuid() });
  const result = schema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "Invalid User ID!" }, { status: 400 });
  }

  const { userId } = result.data;
  const projectId = params.id;
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    if (userId === project.ownerId) {
      return NextResponse.json(
        { error: "Cannot delete owner!" },
        { status: 400 }
      );
    }

    await prisma.membership.deleteMany({
      where: {
        projectId,
        userId,
      },
    });

    return NextResponse.json({ message: "Member deleted." });
  } catch (error) {
    if (error instanceof Error)
      return new Response(error.message, { status: 500 });
    return new Response("Internal Server Error", { status: 500 });
  }
}) as NextAuthAPIRouteHandler;
