"use client";

import { useState } from "react";
import { PriceCard } from "./PriceCard";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PriceData, PriceListProps } from "@/types/price";

export function PriceList({ initialPrices, prevPrices }: PriceListProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const getPrevPrice = (commodity: string, district: string) => {
        return prevPrices.find(
            (p: PriceData) => p.commodity === commodity && p.district === district
        )?.price;
    };

    const filteredPrices = initialPrices.filter((p: PriceData) =>
        p.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.district.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const kodaguPrices = filteredPrices.filter((p: PriceData) => p.district === "KODAGU");
    const hassanPrices = filteredPrices.filter((p: PriceData) => p.district === "HASSAN");

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    return (
        <div className="space-y-16">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative max-w-md mx-auto"
            >
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-full blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/30 transition-colors group-focus-within:text-primary z-10" />
                    <Input
                        type="text"
                        placeholder="Search markets or commodities..."
                        className="relative pl-14 pr-14 py-7 rounded-full border border-border/50 bg-card/60 backdrop-blur-xl hover:bg-card/80 focus:bg-card/90 focus:border-primary/30 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus:shadow-[0_20px_40px_rgba(0,0,0,0.08)] text-sm font-bold tracking-tight text-primary placeholder:text-foreground/30 placeholder:font-medium ring-0 focus-visible:ring-0"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-5 top-1/2 -translate-y-1/2 p-2 hover:bg-foreground/5 rounded-full transition-colors z-10"
                        >
                            <X className="h-4 w-4 text-foreground/40" />
                        </button>
                    )}
                </div>
            </motion.div>

            {filteredPrices.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-24 border border-dashed border-border rounded-3xl bg-primary/5"
                >
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 mb-3">No Results Found</p>
                    <p className="text-sm text-foreground/60 mb-6 font-medium">We couldn&apos;t find any records matching &quot;{searchQuery}&quot;</p>
                    <button
                        onClick={() => setSearchQuery("")}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-90 transition-opacity"
                    >
                        Reset Filter
                    </button>
                </motion.div>
            )}

            <AnimatePresence mode="popLayout" initial={false}>
                {kodaguPrices.length > 0 && (
                    <motion.div
                        key="kodagu"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        className="space-y-8"
                    >
                        <div className="flex items-center gap-4 px-1">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary whitespace-nowrap">
                                Kodagu Sector
                            </h2>
                            <div className="w-full h-[1px] bg-border/50" />
                        </div>
                        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
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
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        className="space-y-8 pt-12"
                    >
                        <div className="flex items-center gap-4 px-1">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary whitespace-nowrap">
                                Hassan Sector
                            </h2>
                            <div className="w-full h-[1px] bg-border/50" />
                        </div>
                        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
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
