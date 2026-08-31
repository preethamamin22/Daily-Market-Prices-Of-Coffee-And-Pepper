"use client";

import { useState } from "react";
import { PriceCard } from "./PriceCard";
import { Input } from "@/components/ui/input";
import { Search, X, SlidersHorizontal, Building2, Layers } from "lucide-react";
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
        <div className="space-y-12">
            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto bg-card/70 backdrop-blur-xl p-3 rounded-2xl border border-border/60 shadow-sm">
                {/* Sector Switch Tabs */}
                <div className="flex items-center gap-1 bg-muted/60 p-1.5 rounded-xl w-full md:w-auto">
                    <button
                        onClick={() => setActiveSector("ALL")}
                        className={`flex-1 md:flex-none px-4 py-2 text-xs font-extrabold rounded-lg transition-all ${
                            activeSector === "ALL"
                                ? "bg-background text-primary shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        All Markets ({initialPrices.length})
                    </button>
                    <button
                        onClick={() => setActiveSector("KODAGU")}
                        className={`flex-1 md:flex-none px-4 py-2 text-xs font-extrabold rounded-lg transition-all ${
                            activeSector === "KODAGU"
                                ? "bg-background text-primary shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Kodagu ({initialPrices.filter(p => p.district === "KODAGU").length})
                    </button>
                    <button
                        onClick={() => setActiveSector("HASSAN")}
                        className={`flex-1 md:flex-none px-4 py-2 text-xs font-extrabold rounded-lg transition-all ${
                            activeSector === "HASSAN"
                                ? "bg-background text-primary shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Hassan ({initialPrices.filter(p => p.district === "HASSAN").length})
                    </button>
                </div>

                {/* Search Input */}
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Input
                        type="text"
                        placeholder="Search Arabica, Pepper..."
                        className="pl-10 pr-10 py-2.5 rounded-xl border border-border/50 bg-background/80 shadow-xs focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs font-semibold"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-md transition-colors z-10"
                        >
                            <X className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                    )}
                </div>
            </div>

            {/* Empty Search Result */}
            {filteredPrices.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20 border border-dashed border-border/80 rounded-3xl bg-muted/20 max-w-xl mx-auto p-8"
                >
                    <div className="h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-4">
                        <SlidersHorizontal className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-extrabold uppercase tracking-widest text-muted-foreground mb-1">No Matching Commodities</p>
                    <p className="text-xs text-muted-foreground mb-6 font-medium">No market prices found for &quot;{searchQuery}&quot; in {activeSector} sector.</p>
                    <button
                        onClick={() => { setSearchQuery(""); setActiveSector("ALL"); }}
                        className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-black uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm"
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
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-3 px-1">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                                <Building2 className="h-4 w-4" />
                            </div>
                            <div>
                                <h2 className="text-sm font-black uppercase tracking-widest text-foreground">
                                    Kodagu Sector Hub
                                </h2>
                                <p className="text-[11px] text-muted-foreground font-medium">Madikeri & Virajpet Commodity Markets</p>
                            </div>
                            <div className="flex-1 h-[1px] bg-border/60 ml-2" />
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
                        className="space-y-6 pt-4"
                    >
                        <div className="flex items-center gap-3 px-1">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                                <Building2 className="h-4 w-4" />
                            </div>
                            <div>
                                <h2 className="text-sm font-black uppercase tracking-widest text-foreground">
                                    Hassan Sector Hub
                                </h2>
                                <p className="text-[11px] text-muted-foreground font-medium">Sakleshpur & Belur Commodity Markets</p>
                            </div>
                            <div className="flex-1 h-[1px] bg-border/60 ml-2" />
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
