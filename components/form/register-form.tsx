"use client";

import { useActionState } from "react";
import { registerUser } from "@/actions/authenticate";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  AtSign,
  CircleAlert,
  LoaderCircle,
  LockKeyhole,
  SquarePen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function RegisterForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [response, formAction, isPending] = useActionState(
    registerUser,
    undefined
  );

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-slate-100 px-6 pb-4 pt-8">
        <h1 className="mb-3 text-2xl">Welcome to Zentask!</h1>
        {response &&
          (response === "success" ? (
            <Alert variant="success">
              <CircleAlert className="size-5" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Successfully registered! Please check your email for
                verification.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <CircleAlert className="size-5" />
              <AlertTitle>Warning!</AlertTitle>
              <AlertDescription>
                {typeof response === "string"
                  ? response
                  : "An unexpected error occurred"}
              </AlertDescription>
            </Alert>
          ))}
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="username"
            >
              Username
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="username"
                type="text"
                name="username"
                placeholder="Enter your name"
                required
              />
              <SquarePen className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <AtSign className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <Button className="mt-4 w-full" type="submit" disabled={isPending}>
          Sign up
          {!isPending ? (
            <ArrowRight className="ml-auto size-5 text-gray-50" />
          ) : (
            <LoaderCircle className="ml-auto animate-spin size-5 text-gray-50" />
          )}
        </Button>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        ></div>
      </div>
    </form>
  );
}
