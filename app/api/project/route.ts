import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, NextAuthAPIRouteHandler } from "@/auth";

export const POST = auth(async function POST(request) {
  if (!request.auth || !request.auth.user)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  try {
    const data = await request.json();
    const { title, image, ownerId } = data;
    const [imageId, imageThumbUrl, imageFullUrl, imageUserName, imageLinkHTML] =
      image.split("|");

    if (
      !imageId ||
      !imageThumbUrl ||
      !imageFullUrl ||
      !imageUserName ||
      !imageLinkHTML
    ) {
      return NextResponse.json(
        { message: "Missing fields. Failed create project." },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name: title,
        ownerId,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageUserName,
        imageLinkHTML,
      },
    });

    return Response.json(
      { message: "Project created successfully.", body: project },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error)
      return new Response(error.message, { status: 500 });
    return new Response("Internal Server Error", { status: 500 });
  }
}) as NextAuthAPIRouteHandler;

// Get all projects for the authenticated user.
export const GET = auth(async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get("limit");
  const page = searchParams.get("page");

  if (!request.auth || !request.auth.user)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  try {
    const projects = await prisma.project.findMany({
      take: limit ? parseInt(limit) : undefined,
      skip: page ? (parseInt(page) - 1) * (limit ? parseInt(limit) : 10) : 0,
      where: {
        ownerId: request.auth.user.id,
      },
      select: {
        id: true,
        name: true,
        imageThumbUrl: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: { name: true, email: true, image: true },
        },
      },
    });

    return NextResponse.json(
      { message: "Projects fetched successfully.", body: projects },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return new Response(error.message, { status: 500 });
    return new Response("Internal Server Error", { status: 500 });
  }
}) as NextAuthAPIRouteHandler;

// Update a project by ID.
export const PUT = auth(async function PUT(request) {
  const searchParams = request.nextUrl.searchParams;
  const projectId = searchParams.get("projectId");
  const data = await request.json();
  const { title } = data;

  if (!request.auth || !request.auth.user)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  try {
    if (!projectId) {
      return NextResponse.json(
        { message: "Project ID is required." },
        { status: 400 }
      );
    }
    const project = await prisma.project.update({
      where: {
        id: projectId,
        ownerId: request.auth.user.id,
      },
      data: {
        name: title,
      },
    });
    return NextResponse.json(
      { message: "Project updated successfully.", body: project },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return new Response(error.message, { status: 500 });
    return new Response("Internal Server Error", { status: 500 });
  }
}) as NextAuthAPIRouteHandler;

// Delete a project by ID.
export const DELETE = auth(async function DELETE(request) {
  const searchParams = request.nextUrl.searchParams;
  const projectId = searchParams.get("projectId");

  if (!request.auth || !request.auth.user)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  try {
    if (!projectId) {
      return NextResponse.json(
        { message: "Project ID is required." },
        { status: 400 }
      );
    }

    const project = await prisma.project.delete({
      where: {
        id: projectId,
        ownerId: request.auth.user.id,
      },
    });

    return NextResponse.json(
      { message: "Project deleted successfully.", body: project },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return new Response(error.message, { status: 500 });
    return new Response("Internal Server Error", { status: 500 });
  }
}) as NextAuthAPIRouteHandler;
