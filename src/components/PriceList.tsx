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
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/20 transition-colors group-focus-within:text-primary" />
                    <Input
                        type="text"
                        placeholder="Search specific markets or commodities..."
                        className="pl-11 pr-11 py-7 rounded-2xl border-border bg-card hover:border-primary/30 focus:border-primary transition-all shadow-sm focus:shadow-md text-sm font-bold tracking-tight placeholder:text-foreground/20 placeholder:font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-muted rounded-xl transition-colors"
                        >
                            <X className="h-4 w-4 text-foreground/30" />
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
