import NextAuth from "next-auth"
import bcrypt from "bcryptjs"
import prisma from "@/prisma/client"
import Credentials from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;

        if (!email || !password) throw new Error("Invalid Credentials")

        user = await prisma.user.findUnique({
          where: {
            email
          }
        });

        if (!user) throw new Error("Invalid email or password");

        const isMatched = bcrypt.compareSync(password, user.password as string);

        if (!isMatched) throw new Error("Invalid email or password");

        return user
      },
    }),
    GoogleProvider,
    GithubProvider
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login"
  }
})