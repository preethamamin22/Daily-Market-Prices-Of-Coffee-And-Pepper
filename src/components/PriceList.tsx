"use client";

import { useState } from "react";
import { PriceCard } from "./PriceCard";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PriceListProps {
    initialPrices: any[];
    prevPrices: any[];
}

export function PriceList({ initialPrices, prevPrices }: PriceListProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const getPrevPrice = (commodity: string, district: string) => {
        return prevPrices.find(
            (p: any) => p.commodity === commodity && p.district === district
        )?.price;
    };

    const filteredPrices = initialPrices.filter((p: any) =>
        p.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.district.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const kodaguPrices = filteredPrices.filter((p: any) => p.district === "KODAGU");
    const hassanPrices = filteredPrices.filter((p: any) => p.district === "HASSAN");

    return (
        <div className="space-y-8">
            <div className="relative max-w-md mx-auto mb-10">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        type="text"
                        placeholder="Search commodity or district..."
                        className="pl-10 pr-10 py-6 rounded-2xl border-2 border-muted hover:border-primary/50 focus:border-primary transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                        >
                            <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                    )}
                </div>
            </div>

            {filteredPrices.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20 bg-background/50 rounded-3xl border-2 border-dashed border-muted"
                >
                    <p className="text-xl text-muted-foreground">No matches found for "{searchQuery}"</p>
                    <button
                        onClick={() => setSearchQuery("")}
                        className="mt-4 text-primary font-semibold hover:underline"
                    >
                        Clear Search
                    </button>
                </motion.div>
            )}

            <AnimatePresence mode="popLayout">
                {kodaguPrices.length > 0 && (
                    <motion.div
                        key="kodagu"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-4"
                    >
                        <h2 className="text-2xl font-bold flex items-center gap-3 px-2">
                            <span className="w-2 h-8 bg-primary rounded-full" />
                            Kodagu District
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {kodaguPrices.map((p: any) => (
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
                        </div>
                    </motion.div>
                )}

                {hassanPrices.length > 0 && (
                    <motion.div
                        key="hassan"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-4 pt-4"
                    >
                        <h2 className="text-2xl font-bold flex items-center gap-3 px-2">
                            <span className="w-2 h-8 bg-amber-500 rounded-full" />
                            Hassan District
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {hassanPrices.map((p: any) => (
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
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
