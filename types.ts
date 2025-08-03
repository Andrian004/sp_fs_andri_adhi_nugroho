import { Task, List } from "@prisma/client";
export type SuccesResponse<T> = {
  body: T;
};

export type Project = {
  createdAt: string;
  id: string;
  imageThumbUrl: string;
  name: string;
  owner: { name: string; email: string; image: string | null };
  updatedAt: string;
};
export type ProjectWithImage = {
  createdAt: string;
  id: string;
  imageFullUrl: string;
  name: string;
  owner: { name: string; email: string; image: string | null };
  updatedAt: string;
};

export type TaskWithAssignee = Task & {
  assignee: { id: string; name: string; image: string };
};

export type ListWithCards = List & { task: TaskWithAssignee[] };

export type CardWithList = Task & {
  list: List;
  assignee: { id: string; name: string; image: string };
};

export type Member = {
  id: string;
  ownerId: string;
  name: string;
  email: string;
  image?: string;
  status: "owner" | "member";
};
