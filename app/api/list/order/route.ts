import { auth, NextAuthAPIRouteHandler } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

export const PUT = auth(async function PUT(request) {
  if (!request.auth || !request.auth.user)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  let lists;

  try {
    const data = await request.json();
    const { items }: ListOrderData = data;

    const transaction = items.map((list) =>
      prisma.list.update({
        where: {
          id: list.id,
          project: {
            OR: [
              { ownerId: request.auth?.user?.id },
              { memberships: { some: { userId: request.auth?.user?.id } } },
            ],
          },
        },
        data: {
          order: list.order,
        },
      })
    );

    lists = await prisma.$transaction(transaction);

    return NextResponse.json(
      { message: "List updated successfully.", body: lists },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return new Response(error.message, { status: 500 });
    return new Response("Internal Server Error", { status: 500 });
  }
}) as NextAuthAPIRouteHandler;
