"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Coffee, User, Menu, X, History, LayoutDashboard, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "/", label: "Prices", icon: Coffee },
        { href: "/history", label: "History", icon: History },
        { href: "/about", label: "About", icon: Info },
    ];

    return (
        <>
            <header
                className={`sticky top-0 z-[100] w-full transition-all duration-300 ${isScrolled
                        ? "bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-muted shadow-lg shadow-black/5 py-2"
                        : "bg-transparent py-4"
                    }`}
            >
                <div className="container flex h-14 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
                    <Link className="flex items-center gap-2.5 transition-transform hover:scale-105 active:scale-95" href="/">
                        <div className="bg-primary rounded-xl p-2 shadow-lg shadow-primary/20">
                            <Coffee className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="font-black text-xl tracking-tighter text-foreground hidden sm:inline-block">Kodagu & Hassan</span>
                        <span className="font-black text-xl tracking-tighter text-foreground sm:hidden">K & H Prices</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-1 bg-muted/50 p-1 rounded-2xl border border-muted ring-1 ring-black/5">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                className="px-5 py-2 text-xs font-bold rounded-xl hover:bg-background hover:shadow-sm transition-all text-muted-foreground hover:text-primary active:scale-95 flex items-center gap-2"
                                href={link.href}
                            >
                                <link.icon className="h-3.5 w-3.5" />
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">
                        <Link href="/login" className="hidden sm:block">
                            <Button variant="ghost" size="sm" className="rounded-xl font-bold text-xs gap-2">
                                <User className="h-4 w-4" />
                                Admin
                            </Button>
                        </Link>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2.5 bg-muted/50 rounded-xl border border-muted text-muted-foreground hover:text-primary transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-[90] bg-background/80 backdrop-blur-xl pt-24 px-6 md:hidden"
                    >
                        <nav className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-4 p-5 bg-muted/30 rounded-3xl border border-muted hover:border-primary transition-all group"
                                >
                                    <div className="bg-background p-3 rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <link.icon className="h-6 w-6" />
                                    </div>
                                    <span className="text-xl font-black tracking-tight">{link.label}</span>
                                </Link>
                            ))}
                            <Link
                                href="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-4 p-5 bg-primary text-primary-foreground rounded-3xl mt-4 shadow-xl shadow-primary/20"
                            >
                                <div className="bg-primary-foreground/20 p-3 rounded-2xl">
                                    <User className="h-6 w-6" />
                                </div>
                                <span className="text-xl font-black tracking-tight">Admin Login</span>
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
