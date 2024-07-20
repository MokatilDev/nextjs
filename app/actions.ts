"use server";

import { signIn } from "@/auth";
import prisma from "@/prisma/client";
import { ERROR_TYPES } from "@/types/errors";
import { saltAndHashPassword } from "@/utils/saltAndHashPassword";
import { AUTH_PROVIDER } from "@prisma/client";
import { AuthError } from "next-auth";

export const registerUser = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    let existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { errorType: ERROR_TYPES.DUBLICATE_EMAIL, error: "Email is already exist" }
    existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) return { errorType: ERROR_TYPES.DUBLICATE_USERNAME, error: "Username is already exist" }

    const hashedPassword = saltAndHashPassword(password);

    const user = await prisma.user.create({
        data: {
            email,
            username,
            password: hashedPassword,
            authProvider: AUTH_PROVIDER.LOCAL,
            authProviderId: email
        }
    })

    return { message: "user has been register", user }
}

export const loginUser = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false
        })
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: error.cause?.err?.message }
        }
        return { error: "Something worning!" }
    }
}

export const loginWithGoogle = async () => {
    await signIn("google", {
        redirectTo: "/"
    })
}

export const loginWithGithub = async () => {
    await signIn("github", {
        redirectTo: "/"
    })
}