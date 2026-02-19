"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface PriceCardProps {
    commodity: string;
    district: string;
    price: number;
    unit: string;
    date: string | Date;
    previousPrice?: number;
}

export function PriceCard({ commodity, district, price, unit, date, previousPrice }: PriceCardProps) {
    const trend = previousPrice ? (price > previousPrice ? "up" : price < previousPrice ? "down" : "steady") : "steady";
    const formattedCommodity = commodity.replace("_", " ");

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 20
            }
        }
    };

    return (
        <motion.div
            variants={itemVariants}
            layout
            whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
            whileTap={{ scale: 0.98 }}
            className="group"
        >
            <Card className="overflow-hidden border border-border bg-card shadow-sm group-hover:border-primary/20 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-500">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-8">
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/40">
                                <MapPin className="h-3 w-3" />
                                {district}
                            </div>
                            <h3 className="text-xl font-bold capitalize tracking-tight text-primary">{formattedCommodity.toLowerCase()}</h3>
                        </div>
                        <div className={`text-[10px] font-black uppercase tracking-[0.1em] px-2 py-1 rounded-full flex items-center gap-1 ${trend === "up" ? "bg-green-50 text-green-700 border border-green-100" :
                            trend === "down" ? "bg-red-50 text-red-700 border border-red-100" :
                                "bg-muted text-foreground/40"
                            }`}>
                            {trend === "up" && <ArrowUpIcon className="h-2.5 w-2.5" />}
                            {trend === "down" && <ArrowDownIcon className="h-2.5 w-2.5" />}
                            {trend === "steady" && <MinusIcon className="h-2.5 w-2.5" />}
                            {trend}
                        </div>
                    </div>

                    <div className="flex items-baseline gap-1 mb-8">
                        <span className="text-4xl font-bold tracking-tighter text-primary">₹{price.toLocaleString()}</span>
                        <span className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest">/ {unit}</span>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-border/50">
                        <div className="flex items-center gap-2 text-[10px] text-foreground/40 font-bold uppercase tracking-wider">
                            <Calendar className="h-3 w-3 opacity-30" />
                            {format(new Date(date), "dd MMM")}
                        </div>
                        <a
                            href={`/history?commodity=${commodity}&district=${district}`}
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-primary/70 transition-colors pb-0.5 border-b-2 border-primary/20 hover:border-primary"
                        >
                            Analyze
                        </a>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
