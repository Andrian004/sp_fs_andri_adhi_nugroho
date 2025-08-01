import { Suspense } from "react";
import Image from "next/image";
import { RegisterForm } from "@/components/form/register-form";

export default function RegisterPage() {
  return (
    <main className="flex items-center justify-center md:min-h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4">
        <div className="flex h-20 w-full items-end rounded-lg bg-gradient-to-tr from-slate-100 to-slate-800 p-3 md:h-36">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
        </div>
        <Suspense>
          <RegisterForm />
        </Suspense>
      </div>
    </main>
  );
}
