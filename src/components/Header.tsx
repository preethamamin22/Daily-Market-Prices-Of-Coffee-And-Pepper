import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Coffee, User } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function Header() {
    let session = null;
    try {
        session = await getServerSession(authOptions);
    } catch (e) {
        console.error("Header Authentication Error:", e);
    }
    const isAdmin = (session?.user as any)?.role === "ADMIN";

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-foreground">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <Link className="flex items-center gap-2 font-bold text-xl" href="/">
                    <Coffee className="h-6 w-6 text-primary" />
                    <span>Kodagu & Hassan Prices</span>
                </Link>
                <nav className="hidden md:flex gap-6">
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
                        Today's Prices
                    </Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/history">
                        Price History
                    </Link>
                    {isAdmin && (
                        <>
                            <Link className="text-sm font-medium hover:underline underline-offset-4" href="/admin">
                                Dashboard
                            </Link>
                            <Link className="text-sm font-medium hover:underline underline-offset-4" href="/admin/users">
                                Analytics
                            </Link>
                        </>
                    )}
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/about">
                        About
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    {session ? (
                        <div className="flex items-center gap-3">
                            <span className="text-sm hidden sm:inline-block">
                                {session.user?.name || session.user?.email}
                            </span>
                            <Link href="/admin">
                                <Button size="sm" variant="ghost" className="rounded-full h-8 w-8 p-0">
                                    <User className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button variant="outline" size="sm">
                                Admin Login
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
