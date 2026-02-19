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

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className="group"
        >
            <Card className="overflow-hidden border border-muted bg-background shadow-none hover:border-primary/20 transition-all duration-200">
                <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-6">
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                                <MapPin className="h-3 w-3" />
                                {district}
                            </div>
                            <h3 className="text-lg font-bold capitalize tracking-tight">{formattedCommodity.toLowerCase()}</h3>
                        </div>
                        <div className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${trend === "up" ? "text-green-600" :
                                trend === "down" ? "text-red-600" :
                                    "text-muted-foreground/60"
                            }`}>
                            {trend === "up" && <ArrowUpIcon className="h-3 w-3" />}
                            {trend === "down" && <ArrowDownIcon className="h-3 w-3" />}
                            {trend === "steady" && <MinusIcon className="h-3 w-3" />}
                            {trend}
                        </div>
                    </div>

                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-3xl font-bold tracking-tight">₹{price.toLocaleString()}</span>
                        <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest">/ {unit}</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-muted/30">
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60 font-medium">
                            <Calendar className="h-3 w-3 opacity-40" />
                            {format(new Date(date), "dd MMM, h:mm a")}
                        </div>
                        <a
                            href={`/history?commodity=${commodity}&district=${district}`}
                            className="text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors pb-0.5 border-b border-transparent hover:border-primary"
                        >
                            History
                        </a>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
