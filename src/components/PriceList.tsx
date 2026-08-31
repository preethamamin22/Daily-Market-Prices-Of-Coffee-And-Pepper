"use client";

import { useState } from "react";
import { PriceCard } from "./PriceCard";
import { Input } from "@/components/ui/input";
import { Search, X, SlidersHorizontal, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PriceData, PriceListProps } from "@/types/price";

export function PriceList({ initialPrices, prevPrices }: PriceListProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeSector, setActiveSector] = useState<"ALL" | "KODAGU" | "HASSAN">("ALL");

    const getPrevPrice = (commodity: string, district: string) => {
        return prevPrices.find(
            (p: PriceData) => p.commodity === commodity && p.district === district
        )?.price;
    };

    const filteredPrices = initialPrices.filter((p: PriceData) => {
        const matchesQuery = 
            p.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.district.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSector = activeSector === "ALL" || p.district === activeSector;
        return matchesQuery && matchesSector;
    });

    const kodaguPrices = filteredPrices.filter((p: PriceData) => p.district === "KODAGU");
    const hassanPrices = filteredPrices.filter((p: PriceData) => p.district === "HASSAN");

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    };

    return (
        <div className="space-y-10">
            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto bg-[#111a2e] p-3.5 rounded-2xl border border-[#1e2d4a] shadow-xl">
                {/* Sector Switch Tabs */}
                <div className="flex items-center gap-1.5 bg-[#090e1a] p-1.5 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setActiveSector("ALL")}
                        className={`flex-1 md:flex-none px-4 py-2 text-xs font-black rounded-lg transition-all ${
                            activeSector === "ALL"
                                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                                : "text-slate-300 hover:text-white hover:bg-white/5"
                        }`}
                    >
                        All Markets ({initialPrices.length})
                    </button>
                    <button
                        onClick={() => setActiveSector("KODAGU")}
                        className={`flex-1 md:flex-none px-4 py-2 text-xs font-black rounded-lg transition-all ${
                            activeSector === "KODAGU"
                                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                                : "text-slate-300 hover:text-white hover:bg-white/5"
                        }`}
                    >
                        Kodagu ({initialPrices.filter(p => p.district === "KODAGU").length})
                    </button>
                    <button
                        onClick={() => setActiveSector("HASSAN")}
                        className={`flex-1 md:flex-none px-4 py-2 text-xs font-black rounded-lg transition-all ${
                            activeSector === "HASSAN"
                                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                                : "text-slate-300 hover:text-white hover:bg-white/5"
                        }`}
                    >
                        Hassan ({initialPrices.filter(p => p.district === "HASSAN").length})
                    </button>
                </div>

                {/* Search Input */}
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                    <Input
                        type="text"
                        placeholder="Search Arabica, Pepper..."
                        className="pl-10 pr-10 py-2.5 rounded-xl border border-[#1e2d4a] bg-[#090e1a] text-white shadow-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-xs font-bold placeholder:text-slate-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-800 rounded-md transition-colors z-10"
                        >
                            <X className="h-3.5 w-3.5 text-slate-400" />
                        </button>
                    )}
                </div>
            </div>

            {/* Empty Search Result */}
            {filteredPrices.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16 border border-dashed border-[#1e2d4a] rounded-3xl bg-[#111a2e] max-w-xl mx-auto p-8"
                >
                    <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center mb-4 border border-emerald-500/20">
                        <SlidersHorizontal className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-black uppercase tracking-widest text-slate-200 mb-1">No Matching Commodities</p>
                    <p className="text-xs text-slate-400 mb-6 font-medium">No market prices found for &quot;{searchQuery}&quot; in {activeSector} sector.</p>
                    <button
                        onClick={() => { setSearchQuery(""); setActiveSector("ALL"); }}
                        className="px-5 py-2.5 bg-emerald-500 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-emerald-400 transition-colors shadow-md"
                    >
                        Reset All Filters
                    </button>
                </motion.div>
            )}

            {/* Price Cards Grid */}
            <AnimatePresence mode="popLayout">
                {kodaguPrices.length > 0 && (
                    <motion.div
                        key="kodagu"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0 }}
                        className="space-y-5"
                    >
                        <div className="flex items-center gap-3 px-1">
                            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <Building2 className="h-4 w-4" />
                            </div>
                            <div>
                                <h2 className="text-sm font-black uppercase tracking-widest text-white">
                                    Kodagu Sector Hub (ಕೊಡಗು)
                                </h2>
                                <p className="text-[11px] text-slate-400 font-medium">Madikeri & Virajpet Commodity Markets</p>
                            </div>
                            <div className="flex-1 h-[1px] bg-[#1e2d4a] ml-2" />
                        </div>
                        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {kodaguPrices.map((p: PriceData) => (
                                <PriceCard
                                    key={p.id}
                                    commodity={p.commodity}
                                    district={p.district}
                                    price={p.price}
                                    unit={p.unit}
                                    date={p.date}
                                    previousPrice={getPrevPrice(p.commodity, p.district)}
                                />
                            ))}
                        </motion.div>
                    </motion.div>
                )}

                {hassanPrices.length > 0 && (
                    <motion.div
                        key="hassan"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0 }}
                        className="space-y-5 pt-4"
                    >
                        <div className="flex items-center gap-3 px-1">
                            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <Building2 className="h-4 w-4" />
                            </div>
                            <div>
                                <h2 className="text-sm font-black uppercase tracking-widest text-white">
                                    Hassan Sector Hub (ಹಾಸನ)
                                </h2>
                                <p className="text-[11px] text-slate-400 font-medium">Sakleshpur & Belur Commodity Markets</p>
                            </div>
                            <div className="flex-1 h-[1px] bg-[#1e2d4a] ml-2" />
                        </div>
                        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {hassanPrices.map((p: PriceData) => (
                                <PriceCard
                                    key={p.id}
                                    commodity={p.commodity}
                                    district={p.district}
                                    price={p.price}
                                    unit={p.unit}
                                    date={p.date}
                                    previousPrice={getPrevPrice(p.commodity, p.district)}
                                />
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
