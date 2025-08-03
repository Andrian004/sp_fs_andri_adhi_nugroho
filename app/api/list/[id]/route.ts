import { auth, NextAuthAPIRouteHandler } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type ProtectedApiParams = {
  params?: {
    id?: string;
  };
};

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
      { message: "List ID is required" },
      { status: 400 }
    );
  }

  const list = await prisma.list.delete({
    where: {
      id: params.id,
      project: {
        OR: [
          { ownerId: request.auth.user.id },
          { memberships: { some: { userId: request.auth.user.id } } },
        ],
      },
    },
  });

  return NextResponse.json(
    { message: "List deleted successfully.", body: list },
    { status: 200 }
  );
}) as NextAuthAPIRouteHandler;
