/**
 * NextAuth.js configuration
 * Supports: Email magic link, Google OAuth, Credentials
 * Uses Prisma adapter for session persistence
 */

import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "./prisma";
import type { Adapter, AdapterUser } from "next-auth/adapters";

/**
 * Minimal Prisma adapter for NextAuth
 */
function PrismaAdapter(): Adapter {
  return {
    async createUser(user: any) {
      const created = await prisma.user.create({
        data: {
          email: user.email,
          name: user.name ?? null,
          image: user.image ?? null,
          role: "HOMEOWNER",
        },
      });
      return { ...created, emailVerified: null } as AdapterUser;
    },
    async getUser(id: string) {
      const user = await prisma.user.findUnique({ where: { id } });
      return user
        ? ({ ...user, emailVerified: user.emailVerified ?? null } as any)
        : null;
    },
    async getUserByEmail(email: string) {
      const user = await prisma.user.findUnique({ where: { email } });
      return user
        ? ({ ...user, emailVerified: user.emailVerified ?? null } as any)
        : null;
    },
    async getUserByAccount({ providerAccountId, provider }: any) {
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: { provider, providerAccountId },
        },
        include: { user: true },
      });
      return account?.user
        ? ({
            ...account.user,
            emailVerified: account.user.emailVerified ?? null,
          } as any)
        : null;
    },
    async updateUser(user: any) {
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: user.name,
          email: user.email,
          image: user.image,
        },
      });
      return { ...updated, emailVerified: updated.emailVerified ?? null } as any;
    },
    async deleteUser(userId: string) {
      await prisma.user.delete({ where: { id: userId } });
    },
    async linkAccount(account: any) {
      await prisma.account.create({
        data: {
          userId: account.userId,
          type: account.type,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state,
        },
      });
    },
    async createSession(session: any) {
      return prisma.session.create({
        data: {
          sessionToken: session.sessionToken,
          userId: session.userId,
          expires: session.expires,
        },
      });
    },
    async getSessionAndUser(sessionToken: string) {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });
      if (!session) return null;
      return {
        session: { ...session, user: session.user as any },
        user: {
          ...session.user,
          emailVerified: session.user.emailVerified ?? null,
        } as any,
      };
    },
    async updateSession(session: any) {
      await prisma.session.update({
        where: { sessionToken: session.sessionToken },
        data: { expires: session.expires },
      });
      return prisma.session.findUnique({
        where: { sessionToken: session.sessionToken },
      }) as any;
    },
    async deleteSession(sessionToken: string) {
      await prisma.session.delete({ where: { sessionToken } });
    },
    async createVerificationToken(token: any) {
      return prisma.verificationToken.create({ data: token }) as any;
    },
    async useVerificationToken({ identifier, token }: any) {
      try {
        const vt = await prisma.verificationToken.delete({
          where: { identifier_token: { identifier, token } },
        });
        return vt as any;
      } catch {
        return null;
      }
    },
  };
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(),
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM || "noreply@heatpump.network",
      async sendVerificationRequest(params: any) {
        const { identifier: email, url } = params;

        if (process.env.NODE_ENV === "development") {
          console.log(`\n=== MAGIC LINK FOR ${email} ===`);
          console.log(url);
          console.log("================================\n");
          return;
        }

        if (!process.env.RESEND_API_KEY) {
          console.log(
            `[Auth] No RESEND_API_KEY. Would send to ${email}: ${url}`
          );
          return;
        }

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: params.provider.from || "Heat Pump Network <noreply@heatpump.network>",
            to: [email],
            subject: "Sign in to Heat Pump Network",
            html: `<p>Click <a href="${url}">here</a> to sign in.</p>
                   <p>If you didn't request this, ignore this email.</p>`,
          }),
        });

        if (!res.ok) {
          console.error("[Auth] Failed to send email:", await res.text());
        }
      },
    }),

    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await compare(
          credentials.password,
          user.passwordHash
        );
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        } as any;
      },
    }),
  ],
  callbacks: {
    async session({ session, user }: any) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;

        if (user.role === "CONTRACTOR_ADMIN") {
          const contractor = await prisma.contractor.findFirst({
            where: { owner: { id: user.id } },
            select: {
              id: true,
              slug: true,
              businessName: true,
              isVerified: true,
            },
          });
          session.user.contractor = contractor;
        }
      }
      return session;
    },
    async signIn() {
      return true;
    },
  },
};

// Extend the default Session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: string;
      contractor?: {
        id: string;
        slug: string;
        businessName: string;
        isVerified: boolean;
      } | null;
    };
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
