import NextAuth, { type DefaultSession } from "next-auth"
import bcrypt from "bcryptjs"
import prisma from "@/prisma/client"
import Credentials from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import { JWT } from "next-auth/jwt"
import { AUTH_PROVIDER } from "@prisma/client"

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

        return { email: user.email, name: user.username, image: user.avatar }
      },
    }),
    GoogleProvider,
    GithubProvider
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider == "google") {

          const existingUser = await prisma.user.findUnique({
            where: {
              email: user.email as string
            }
          })

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email as string,
                username: user.name as string,
                avatar: user.image as string,
                authProvider: AUTH_PROVIDER.GOOGLE,
                authProviderId: user.id as string
              }
            });
          }
        }

        if (account?.provider == "github") {

          const existingUser = await prisma.user.findUnique({
            where: {
              email: user.email as string
            }
          })

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email as string,
                username: user.name as string,
                avatar: user.image as string,
                authProvider: AUTH_PROVIDER.GITHUB,
                authProviderId: user.id as string
              }
            });
          }
        }

        token.email = user.email as string;
        token.username = user.name as string;
        token.avatar = user.image as string;
      }

      return token
    },

    async session({ session, token }) {
      session.user.avatar = token.avatar;
      session.user.email = token.email;
      session.user.username = token.username;

      return session
    }
  }
})

declare module "next-auth" {
  interface Session {
    user: {
      email: string,
      username: string,
      avatar: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    idToken?: string,
    email: string,
    username: string,
    avatar: string
  }
}