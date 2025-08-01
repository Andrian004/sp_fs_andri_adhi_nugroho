"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmail } from "@/actions/authenticate";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const callbackUrl = searchParams.get("redirect") || "/wp-admin";
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verify = async () => {
      const result = await verifyEmail(token);
      if (result.success) {
        setStatus("success");
        router.push(`/auth/login?callbackUrl=${callbackUrl}`);
      } else {
        setStatus("error");
        setErrorMessage(result.message);
      }
    };

    verify();
  }, [token, router, callbackUrl]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      {status === "loading" && (
        <>
          <Loader2 className="animate-spin w-8 h-8 mb-4" />
          <p>Verifying your email, please wait...</p>
        </>
      )}
      {status === "success" && (
        <p>Email verified successfully! Redirecting...</p>
      )}
      {status === "error" && (
        <>
          <p className="text-red-500">
            {errorMessage ? errorMessage : "Something went wrong!"}
          </p>
          <Button onClick={() => router.push("/")}>Go to Home</Button>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmail />
    </Suspense>
  );
}
