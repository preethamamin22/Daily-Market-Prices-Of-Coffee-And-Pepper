"use client";

import Link from "next/link";
// import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
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
        { href: "/", label: "Today" },
        { href: "/history", label: "History" },
        { href: "/about", label: "About" },
    ];

    return (
        <>
            <header
                className={`sticky top-0 z-[100] w-full transition-all duration-300 ${isScrolled
                    ? "bg-background/80 backdrop-blur-md border-b border-muted py-2"
                    : "bg-transparent py-6"
                    }`}
            >
                <div className="container flex h-12 items-center justify-between px-6 max-w-7xl mx-auto">
                    <Link className="flex items-center gap-2 group" href="/">
                        <div className="w-1.5 h-6 bg-primary rounded-full group-hover:scale-y-110 transition-transform" />
                        <span className="font-bold text-lg tracking-tight uppercase">Market Prices</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors relative group"
                                href={link.href}
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link href="/login" className="hidden sm:block">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5" />
                                Admin
                            </span>
                        </Link>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-1 text-muted-foreground hover:text-primary transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[90] bg-background pt-24 px-8 md:hidden"
                    >
                        <nav className="flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-2xl font-bold tracking-tighter hover:text-primary transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                href="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-bold tracking-tighter text-muted-foreground flex items-center gap-3 mt-4"
                            >
                                <User className="h-6 w-6" />
                                Admin Access
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
