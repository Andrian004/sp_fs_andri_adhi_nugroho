"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Member, SuccesResponse } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

export function SettingsContent() {
  const params = useParams<{ id: string }>();
  const session = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const { data, refetch, isLoading, isError } = useQuery<
    SuccesResponse<Member[]>
  >({
    queryKey: ["project-members", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/project/${params.id}/members`);
      if (!res.ok) throw new Error("Failed to load members!");
      const result = await res.json();
      return result;
    },
  });

  const { mutate: addMember, isPending: isAddingMember } = useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch(`/api/project/${params.id}/members`, {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to add member!");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Member successfully added!",
      });
      setEmail("");
      refetch();
    },
    onError: (error) => {
      toast({
        title: error.message || "Failed to add member!",
        variant: "destructive",
      });
    },
  });

  const handleAddMember = () => {
    if (!email) {
      toast({
        title: "Email cannot be empty!",
        variant: "destructive",
      });
      return;
    }
    addMember(email);
    setEmail("");
  };

  const { mutate: execDeleteProject, isPending: deleteProjectPending } =
    useMutation({
      mutationFn: async () => {
        const res = await fetch(`/api/project/${params.id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete project!");
        return res.json();
      },
      onSuccess: () => {
        toast({
          title: "Project successfully deleted!",
        });
        window.location.href = "/dashboard";
      },
      onError: (error) => {
        toast({
          title: error.message || "Failed to delete project!",
          variant: "destructive",
        });
      },
    });

  const handleDeleteProject = async () => {
    const confirmed = confirm("Are you sure you want to delete this project?");
    if (!confirmed) return;
    execDeleteProject();
  };

  const { mutate: execRemoveMember, isPending: removeMemberPending } =
    useMutation({
      mutationFn: async ({ userId }: { userId: string }) => {
        await fetch(`/api/project/${params.id}/members`, {
          method: "DELETE",
          body: JSON.stringify({ userId }),
        });
      },
    });

  const handleRemoveMember = async (userId: string) => {
    if (!userId) return;

    const confirmed = confirm("Are you sure want to delete this member?");
    if (!confirmed) return;
    execRemoveMember(
      { userId },
      {
        onSuccess: () => {
          toast({
            title: "Member successfully deleted!",
          });
          refetch();
        },
        onError: (error) => {
          toast({
            title: error.message || "Failed to delete member!",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleExitProject = async () => {
    if (!session.data || !session.data.user) return;

    const confirmed = confirm("Are you sure want to exit from this project?");
    if (!confirmed) return;

    execRemoveMember(
      { userId: session.data.user.id as string },
      {
        onSuccess: () => {
          toast({
            title: "Successfully exited!",
          });
          router.push("/dashboard");
        },
        onError: (error) => {
          toast({
            title: error.message || "Failed to exit!",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (isError) {
    <div>
      <p>Something went wrong. Please reload/refresh the page!</p>
    </div>;
  }

  return (
    <div className="space-y-8 pt-4">
      <Card>
        <CardContent className="p-2">
          <h2 className="text-lg font-semibold mb-4 ps-2">Member List</h2>
          {data && data.body.length === 0 ? (
            <p>There are no members in this project.</p>
          ) : (
            <ul className="space-y-3 bg-slate-100 p-1 rounded-md">
              {data &&
                data.body.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center gap-3 bg-white p-2 shadow rounded-sm"
                  >
                    <div className="flex items-center gap-2 flex-grow">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={member.image} />
                        <AvatarFallback>
                          {member.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{member.name}</span>
                      <span className="text-gray-500 text-sm">
                        ({member.email}) - {member.status}
                      </span>
                    </div>
                    {member.status !== "owner" &&
                      member.ownerId === session.data?.user?.id && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemoveMember(member.id)}
                          disabled={removeMemberPending}
                        >
                          Delete
                        </Button>
                      )}
                  </li>
                ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-4">
          <h2 className="text-lg font-semibold">Add Member</h2>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Email anggota"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={handleAddMember} disabled={isAddingMember}>
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {data &&
      data.body.filter((m) => m.id === session.data?.user?.id)[0].status ===
        "owner" ? (
        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="text-lg font-semibold text-red-600">
              Delete Project
            </h2>
            <p className="text-sm text-gray-600">
              Once deleted, this project cannot be restored.
            </p>
            <Button
              variant="destructive"
              onClick={handleDeleteProject}
              disabled={deleteProjectPending}
            >
              Delete Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="text-lg font-semibold text-red-600">
              Exit from Project
            </h2>
            <p className="text-sm text-gray-600">
              It seems like you{"'"}re tired and looking for a way out. But
              maybe this isn{"'"}t the way out you{"'"}re looking for.
            </p>
            <Button
              variant="destructive"
              onClick={handleExitProject}
              disabled={removeMemberPending}
            >
              Exit
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
