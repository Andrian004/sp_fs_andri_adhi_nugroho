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
