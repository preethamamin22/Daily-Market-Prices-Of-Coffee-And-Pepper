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
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`sticky top-0 z-[100] w-full transition-all duration-500 ease-in-out ${isScrolled
                    ? "bg-background/80 backdrop-blur-xl border-b border-muted/50 py-3 shadow-[0_2px_20px_rgba(0,0,0,0.02)]"
                    : "bg-transparent py-7"
                    }`}
            >
                <div className="container flex h-10 items-center justify-between px-6 max-w-7xl mx-auto">
                    <Link className="flex items-center gap-2 group" href="/">
                        <motion.div
                            whileHover={{ height: 28 }}
                            className="w-1.5 h-6 bg-primary rounded-full transition-all ease-out"
                        />
                        <span className="font-bold text-base tracking-tight uppercase">Market Prices</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70 hover:text-primary transition-all relative group"
                                href={link.href}
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-primary transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-6">
                        <Link href="/login" className="hidden sm:block">
                            <motion.span
                                whileHover={{ x: 2 }}
                                className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70 hover:text-primary transition-colors flex items-center gap-2"
                            >
                                <User className="h-3.5 w-3.5" />
                                Admin
                            </motion.span>
                        </Link>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-1 text-muted-foreground hover:text-primary transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </motion.header>

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
