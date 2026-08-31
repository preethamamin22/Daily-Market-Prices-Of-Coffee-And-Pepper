"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, TrendingUp, Radio, Sparkles } from "lucide-react";
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
        { href: "/", label: "Live Market" },
        { href: "/history", label: "Price Trends & Graphs" },
        { href: "/about", label: "About Exchange" },
    ];

    return (
        <>
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`sticky top-0 z-[100] w-full transition-all duration-300 ${
                    isScrolled
                        ? "bg-[#0b1329]/90 backdrop-blur-2xl border-b border-emerald-500/20 py-3.5 shadow-xl shadow-black/40"
                        : "bg-[#0b1329]/70 backdrop-blur-md py-5 border-b border-white/5"
                }`}
            >
                <div className="container flex items-center justify-between px-4 sm:px-6 max-w-7xl mx-auto">
                    {/* Brand Logo */}
                    <Link className="flex items-center gap-3 group" href="/">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
                            <TrendingUp className="h-6 w-6 stroke-[2.5]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-xl tracking-tight text-white uppercase leading-none">
                                Malnad <span className="text-emerald-400">Exchange</span>
                            </span>
                            <span className="text-[10px] font-extrabold tracking-widest text-emerald-400/80 uppercase mt-0.5">
                                Coffee & Pepper Live Rates
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <nav className="hidden md:flex items-center gap-1 bg-[#131f37]/80 p-1.5 rounded-2xl border border-white/10 shadow-inner">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${
                                        isActive
                                            ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30"
                                            : "text-slate-300 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Live Ticker Pulse */}
                        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black">
                            <Radio className="h-3.5 w-3.5 animate-pulse text-emerald-400" />
                            <span>Live APMC Rates</span>
                        </div>

                        <Link href="/login" className="hidden sm:block">
                            <button className="px-4 py-2 text-xs font-black rounded-xl border border-emerald-500/30 bg-[#131f37] hover:bg-emerald-500/10 text-emerald-400 transition-all flex items-center gap-2 shadow-sm">
                                <User className="h-4 w-4" />
                                <span>Admin Login</span>
                            </button>
                        </Link>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2.5 rounded-xl bg-[#131f37] border border-white/10 text-emerald-400 hover:bg-white/5 transition-colors"
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
                        className="fixed inset-x-0 top-[73px] z-[90] bg-[#0b1329]/95 backdrop-blur-2xl border-b border-emerald-500/20 p-6 md:hidden shadow-2xl space-y-4"
                    >
                        <nav className="flex flex-col gap-2">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`px-4 py-3 rounded-xl text-base font-black transition-all ${
                                            isActive
                                                ? "bg-emerald-500 text-slate-950"
                                                : "text-slate-200 hover:bg-white/5"
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                            <div className="h-[1px] bg-white/10 my-1" />
                            <Link
                                href="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="px-4 py-3 rounded-xl text-base font-black text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-3"
                            >
                                <User className="h-5 w-5" />
                                Admin Access Portal
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
