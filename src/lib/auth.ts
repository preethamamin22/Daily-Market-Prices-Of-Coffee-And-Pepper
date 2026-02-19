import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-dev-only",
    // Add debugging for Vercel
    ...(process.env.NODE_ENV === "production" && !process.env.NEXTAUTH_SECRET ? (
        (() => { console.error("CRITICAL: NEXTAUTH_SECRET is not set in Vercel environment variables!"); return {}; })()
    ) : {}),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("Auth attempt for:", credentials?.email);
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await prisma.user.findUnique({
                        where: { email },
                    });

                    if (!user) {
                        console.warn("Auth failed: User not found", email);
                        return null;
                    }

                    if (!user.password) {
                        console.warn("Auth failed: User has no password set", email);
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if (passwordsMatch) {
                        console.log("Auth success for:", email);
                        // Update login analytics
                        try {
                            await prisma.user.update({
                                where: { id: user.id },
                                data: {
                                    lastLogin: new Date(),
                                    loginCount: { increment: 1 },
                                },
                            });
                        } catch (err) {
                            console.error("Failed to update user analytics:", err);
                        }

                        return {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            role: user.role,
                            image: user.image,
                        };
                    } else {
                        throw new Error("PASSWORD_INCORRECT");
                    }
                } else {
                    throw new Error("INVALID_INPUT");
                }

                return null;
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                // Check if user exists
                const existingUser = await prisma.user.findUnique({
                    where: { googleId: account.providerAccountId },
                });

                if (existingUser) {
                    // Update login analytics
                    await prisma.user.update({
                        where: { id: existingUser.id },
                        data: {
                            lastLogin: new Date(),
                            loginCount: { increment: 1 },
                        },
                    });
                } else {
                    // Create new user
                    await prisma.user.create({
                        data: {
                            email: user.email,
                            name: user.name,
                            googleId: account.providerAccountId,
                            image: user.image,
                            role: "USER",
                            lastLogin: new Date(),
                            loginCount: 1,
                        },
                    });
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.role = (user as { role?: string }).role;
                token.id = user.id;
            }

            // For Google sign-in, fetch user from database
            if (account?.provider === "google") {
                const dbUser = await prisma.user.findUnique({
                    where: { googleId: account.providerAccountId },
                });
                if (dbUser) {
                    token.role = dbUser.role;
                    token.id = dbUser.id;
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as { role?: string; id?: string }).role = token.role as string;
                (session.user as { role?: string; id?: string }).id = token.id as string;
            }
            return session;
        },
    },
};
