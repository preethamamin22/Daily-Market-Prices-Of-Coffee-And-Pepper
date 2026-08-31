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
                email: { label: "Username / Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("Auth attempt for:", credentials?.email);

                const parsedCredentials = z
                    .object({
                        email: z.string().min(1),
                        password: z.string().min(1),
                    })
                    .safeParse(credentials);

                if (!parsedCredentials.success) {
                    throw new Error("INVALID_INPUT");
                }

                const { email: inputIdentifier, password } = parsedCredentials.data;
                const normalizedInput = inputIdentifier.trim().toLowerCase();

                // 1. Direct Hardcoded / Fallback check for Admin Preetham
                const isPreethamUser = 
                    normalizedInput === "preetham" ||
                    normalizedInput === "preetham@example.com" ||
                    normalizedInput === "admin@example.com" ||
                    normalizedInput === "admin";

                if (isPreethamUser && password === "Preetham@22") {
                    console.log("Admin auth success via master credentials for:", inputIdentifier);
                    return {
                        id: "admin-preetham-id",
                        email: "preetham@example.com",
                        name: "Preetham",
                        role: "ADMIN",
                    };
                }

                // 2. Database lookup
                try {
                    const searchEmail = normalizedInput.includes("@") ? normalizedInput : `${normalizedInput}@example.com`;
                    const user = await prisma.user.findFirst({
                        where: {
                            OR: [
                                { email: searchEmail },
                                { name: { equals: inputIdentifier, mode: "insensitive" } },
                            ],
                        },
                    });

                    if (user && user.password) {
                        const passwordsMatch = await bcrypt.compare(password, user.password);
                        if (passwordsMatch) {
                            console.log("Database Auth success for:", user.email);
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
                        }
                    }
                } catch (dbErr) {
                    console.error("Database Auth Lookup Error:", dbErr);
                }

                throw new Error("PASSWORD_INCORRECT");
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                try {
                    const existingUser = await prisma.user.findUnique({
                        where: { googleId: account.providerAccountId },
                    });

                    if (existingUser) {
                        await prisma.user.update({
                            where: { id: existingUser.id },
                            data: {
                                lastLogin: new Date(),
                                loginCount: { increment: 1 },
                            },
                        });
                    } else {
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
                } catch (e) {
                    console.error("Error in Google signIn callback:", e);
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.role = (user as { role?: string }).role;
                token.id = user.id;
            }

            if (account?.provider === "google") {
                try {
                    const dbUser = await prisma.user.findUnique({
                        where: { googleId: account.providerAccountId },
                    });
                    if (dbUser) {
                        token.role = dbUser.role;
                        token.id = dbUser.id;
                    }
                } catch (e) {
                    console.error("Error in Google jwt callback:", e);
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
