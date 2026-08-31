"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, TrendingUp, Radio, Coffee } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "/", label: "Today's Rates" },
        { href: "/history", label: "Price Graphs & Analysis" },
        { href: "/about", label: "About Malnad Hub" },
    ];

    return (
        <>
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`sticky top-0 z-[100] w-full transition-all duration-300 ${
                    isScrolled
                        ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 py-3.5 shadow-sm"
                        : "bg-[#fafaf9] py-5 border-b border-slate-200/50"
                }`}
            >
                <div className="container flex items-center justify-between px-4 sm:px-6 max-w-7xl mx-auto">
                    {/* Brand Logo - Handcrafted Planter Feel */}
                    <Link className="flex items-center gap-3 group" href="/">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                            <Coffee className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-xl tracking-tight text-slate-900 uppercase leading-none">
                                Malnad <span className="text-emerald-700">Market</span>
                            </span>
                            <span className="text-[10px] font-extrabold tracking-widest text-slate-500 uppercase mt-0.5">
                                Coffee & Pepper Exchange
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/70">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                                        isActive
                                            ? "bg-white text-emerald-800 shadow-sm font-black border border-slate-200/60"
                                            : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
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
                        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                            <Radio className="h-3.5 w-3.5 animate-pulse text-emerald-600" />
                            <span>Live APMC Rates</span>
                        </div>

                        <Link href="/login" className="hidden sm:block">
                            <button className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all flex items-center gap-2 shadow-xs">
                                <User className="h-4 w-4 text-emerald-700" />
                                <span>Admin Login</span>
                            </button>
                        </Link>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
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
                        className="fixed inset-x-0 top-[73px] z-[90] bg-white border-b border-slate-200 p-6 md:hidden shadow-xl space-y-4"
                    >
                        <nav className="flex flex-col gap-2">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`px-4 py-3 rounded-xl text-base font-bold transition-all ${
                                            isActive
                                                ? "bg-emerald-700 text-white font-black"
                                                : "text-slate-700 hover:bg-slate-100"
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                            <div className="h-[1px] bg-slate-200 my-1" />
                            <Link
                                href="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="px-4 py-3 rounded-xl text-base font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-3"
                            >
                                <User className="h-5 w-5 text-emerald-700" />
                                Admin Access Portal
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
