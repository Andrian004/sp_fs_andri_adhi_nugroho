"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/schemas/auth.schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { createToken, verifyToken } from "@/lib/token";
import { sendMail } from "@/lib/mail";
import { getVerifyTemplate } from "@/constant/mail-template";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function registerUser(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const { username, email, password } = await registerSchema.parseAsync({
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });
    if (existingUser) throw new Error("User is already exists.");

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name: username,
        email: email,
        password: hashPass,
      },
    });

    const token = createToken({ id: user.id });
    const html = getVerifyTemplate(
      user.name,
      `${process.env.BASE_URL}/auth/verify-email?token=${token}&redirect=${process.env.BASE_URL}/wp-admin`
    );
    await sendMail({ to: user.email, subject: "Verify your email", html });

    return "success";
  } catch (error) {
    // console.log(error);

    if (error instanceof z.ZodError)
      return error.errors.map((e) => e.message).join(", ");
    if (error instanceof Error) return error.message;
    return "An unexpected error occurred.";
  }
}

export async function verifyEmail(token: string) {
  try {
    const payload = verifyToken(token);

    if (!payload.id) {
      return { success: false, message: "Invalid token" };
    }

    // Update email_verified in database
    await prisma.user.update({
      where: { id: payload.id },
      data: { emailVerified: new Date() },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Invalid or expired token" };
  }
}

export async function logout() {
  try {
    // await prisma.session.delete({ where: { sessionToken } });
    await signOut({ redirectTo: "/" });
  } catch (error) {
    throw error;
  }
}
