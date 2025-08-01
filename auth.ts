import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// https://github.com/nextauthjs/next-auth/issues/11727
// https://github.com/nextauthjs/next-auth/discussions/12785
export type NextAuthAPIRouteHandler = (req: Request) => Promise<Response>;

async function getUser(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) return null;

          return user;
        }

        return null;
      },
    }),
  ],
});
