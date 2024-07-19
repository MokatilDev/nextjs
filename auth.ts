import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import prisma from "@/prisma/client";
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;

        if (!email || !password) {
          throw new Error("Please provider all informations");
        }

        const user = await prisma.user.findUnique({
          where: {
            email
          }
        })

        if (!user) throw new Error("Invalid email or password");

        const isMatched = bcrypt.compareSync(password, user.password as string);

        if (!isMatched) throw new Error("Invalid email or password");

        return user;
      }
    })
  ],
})