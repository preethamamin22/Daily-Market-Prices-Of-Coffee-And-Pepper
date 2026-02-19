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
                className="relative max-w-sm mx-auto"
            >
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
                    <Input
                        type="text"
                        placeholder="Search markets..."
                        className="pl-9 pr-9 py-5 rounded-lg border-muted bg-transparent hover:border-muted-foreground/20 focus:border-primary transition-all shadow-none text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-md transition-colors"
                        >
                            <X className="h-3.5 w-3.5 text-muted-foreground/50" />
                        </button>
                    )}
                </div>
            </motion.div>

            {filteredPrices.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20 border border-dashed border-muted rounded-xl"
                >
                    <p className="text-sm text-muted-foreground">No matches for &quot;{searchQuery}&quot;</p>
                    <button
                        onClick={() => setSearchQuery("")}
                        className="mt-2 text-xs font-bold uppercase tracking-widest text-primary hover:underline"
                    >
                        Clear Search
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
                        className="space-y-6"
                    >
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-1 border-b border-muted/30 pb-2">
                            Kodagu District
                        </h2>
                        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
                        className="space-y-6 pt-8"
                    >
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-1 border-b border-muted/30 pb-2">
                            Hassan District
                        </h2>
                        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
