"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, ShieldCheck, ShieldAlert, Loader2, KeyRound, User } from "lucide-react";
import { SmoothWrapper } from "@/components/SmoothWrapper";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [dbStatus, setDbStatus] = useState<"checking" | "up" | "down">("checking");

    useEffect(() => {
        fetch("/api/ping")
            .then(res => res.json())
            .then(data => setDbStatus(data.status === "connected" ? "up" : "down"))
            .catch(() => setDbStatus("down"));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid username or password");
            } else {
                router.push("/admin");
                router.refresh();
            }
        } catch {
            setError("Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            await signIn("google", { callbackUrl: "/admin" });
        } catch {
            setError("Google sign-in failed");
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4 relative overflow-hidden">
            {/* Ambient decorative elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />

            <SmoothWrapper>
                <Card className="w-full max-w-md shadow-2xl border-border bg-card/80 backdrop-blur-md relative z-10 rounded-3xl">
                    <CardHeader className="text-center space-y-4 pt-10">
                        <div className="mx-auto bg-primary/10 p-4 rounded-2xl w-fit text-primary">
                            <Coffee className="h-10 w-10" />
                        </div>
                        <div className="space-y-1">
                            <CardTitle className="text-3xl font-black tracking-tight text-foreground">Admin Portal</CardTitle>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Malnad Market Exchange</p>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6 px-8 pb-10">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 ml-1">
                                    <User className="h-3.5 w-3.5 text-primary" />
                                    Username or Email
                                </Label>
                                <Input
                                    id="email"
                                    type="text"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Preetham"
                                    disabled={loading}
                                    className="rounded-xl border-border/80 py-6 font-bold tracking-tight bg-background/60 focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 ml-1">
                                    <KeyRound className="h-3.5 w-3.5 text-primary" />
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    disabled={loading}
                                    className="rounded-xl border-border/80 py-6 font-bold tracking-tight bg-background/60 focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            {error && <p className="text-xs text-destructive font-extrabold text-center bg-destructive/10 p-2.5 rounded-xl border border-destructive/20">{error}</p>}
                            
                            <Button type="submit" className="w-full py-6 rounded-xl font-extrabold uppercase tracking-wider text-xs shadow-md shadow-primary/20" disabled={loading}>
                                {loading ? "Authorizing..." : "Login to Admin Portal"}
                            </Button>
                        </form>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border/60" />
                            </div>
                            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                                <span className="bg-card px-3 text-muted-foreground">
                                    Alternative Sign In
                                </span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full py-5 rounded-xl border-border/70 font-bold"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                        >
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Sign in with Google
                        </Button>

                        <p className="text-center text-xs font-bold text-muted-foreground mt-4">
                            <Link href="/" className="hover:text-primary transition-colors">
                                ← Back to Home
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </SmoothWrapper>
        </div>
    );
}
