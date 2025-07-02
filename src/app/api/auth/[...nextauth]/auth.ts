import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import prisma from "@/lib/prisma";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),

    LinkedInProvider({
      clientId: process.env.AUTH_LINKEDIN_ID!,
      clientSecret: process.env.AUTH_LINKEDIN_SECRET!,
    }),

    CredentialsProvider({
      name: "OTP Login",
      credentials: {
        email: { label: "Email", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;

        if (!credentials?.email) return null;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) return null;

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          image: user.profilePic,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (!user.email) {
          return false;
        }

        const existingUser = await prisma.user.upsert({
          where: { email: user.email },
          create: {
            email: user.email,
            name: user.name ?? profile?.name ?? "New User",
            profilePic: user.image ?? profile?.picture ?? null,
            provider: account?.provider ?? "unknown",
          },
          update: {
            name: user.name ?? profile?.name ?? undefined,
            profilePic: user.image ?? profile?.picture ?? undefined,
            provider: account?.provider ?? undefined,
          },
        });

        user.id = existingUser.id.toString();

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user?.image;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
} satisfies NextAuthConfig);
