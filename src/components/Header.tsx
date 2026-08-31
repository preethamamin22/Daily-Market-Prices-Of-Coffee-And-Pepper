"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, TrendingUp, Radio } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 15);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "/", label: "Live Dashboard" },
        { href: "/history", label: "Price Trends" },
        { href: "/about", label: "Market Info" },
    ];

    return (
        <>
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`sticky top-0 z-[100] w-full transition-all duration-300 ${
                    isScrolled
                        ? "bg-background/85 backdrop-blur-xl border-b border-border/60 py-3.5 shadow-md"
                        : "bg-background py-5 border-b border-border/30"
                }`}
            >
                <div className="container flex items-center justify-between px-6 max-w-7xl mx-auto">
                    {/* Brand Logo */}
                    <Link className="flex items-center gap-3 group" href="/">
                        <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-lg tracking-tight text-foreground uppercase leading-none">
                                Malnad <span className="text-primary">Market</span>
                            </span>
                            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mt-0.5">
                                Coffee & Pepper Exchange
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <nav className="hidden md:flex items-center gap-1 bg-card/60 p-1.5 rounded-xl border border-border/50 shadow-xs">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all ${
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {/* Live Ticker Pulse */}
                        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                            <Radio className="h-3 w-3 animate-pulse" />
                            <span>Live Rates</span>
                        </div>

                        <Link href="/login" className="hidden sm:block">
                            <button className="px-4 py-2 text-xs font-bold rounded-xl border border-border/60 bg-card hover:bg-muted/60 text-foreground transition-all flex items-center gap-2 shadow-xs">
                                <User className="h-3.5 w-3.5 text-primary" />
                                <span>Admin Login</span>
                            </button>
                        </Link>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-xl bg-card border border-border/60 text-muted-foreground hover:text-primary transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed inset-x-0 top-[73px] z-[90] bg-background/95 backdrop-blur-2xl border-b border-border/80 p-6 md:hidden shadow-2xl"
                    >
                        <nav className="flex flex-col gap-3">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`px-4 py-3 rounded-xl text-base font-bold transition-all ${
                                            isActive
                                                ? "bg-primary text-primary-foreground font-black"
                                                : "text-muted-foreground hover:bg-muted"
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                            <div className="h-[1px] bg-border/50 my-2" />
                            <Link
                                href="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="px-4 py-3 rounded-xl text-base font-bold text-muted-foreground hover:bg-muted flex items-center gap-3"
                            >
                                <User className="h-5 w-5 text-primary" />
                                Admin Access Portal
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
