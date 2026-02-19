"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon, TrendingUp, MapPin, Calendar } from "lucide-react";
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
            <Card className="overflow-hidden border-0 bg-white/60 dark:bg-black/20 backdrop-blur-xl shadow-xl shadow-primary/5 hover:shadow-primary/10 transition-all duration-300 ring-1 ring-black/5 dark:ring-white/5">
                <div className={`h-2 w-full ${commodity.includes("COFFEE") ? "bg-gradient-to-r from-amber-600 to-amber-400" : "bg-gradient-to-r from-green-600 to-green-400"}`} />
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                                <MapPin className="h-3 w-3" />
                                {district}
                            </div>
                            <h3 className="text-xl font-black capitalize tracking-tight text-foreground">{formattedCommodity.toLowerCase()}</h3>
                        </div>
                        <div className={`p-2.5 rounded-2xl ${commodity.includes("COFFEE") ? "bg-amber-100/50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" : "bg-green-100/50 text-green-700 dark:bg-green-900/40 dark:text-green-300"}`}>
                            <TrendingUp className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="flex items-end gap-1 mb-6">
                        <span className="text-4xl font-black tracking-tighter">₹{price.toLocaleString()}</span>
                        <span className="text-sm font-bold text-muted-foreground mb-1">/ {unit}</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-muted/50">
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${trend === "up" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                trend === "down" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                                    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                            }`}>
                            {trend === "up" && <ArrowUpIcon className="h-3 w-3" />}
                            {trend === "down" && <ArrowDownIcon className="h-3 w-3" />}
                            {trend === "steady" && <MinusIcon className="h-3 w-3" />}
                            <span>{trend}</span>
                        </div>

                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1 text-[9px] font-medium text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(date), "dd MMM, h:mm a")}
                            </div>
                            <a
                                href={`/history?commodity=${commodity}&district=${district}`}
                                className="mt-1 text-primary hover:text-primary/80 transition-colors text-[10px] font-bold flex items-center gap-0.5"
                            >
                                History →
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
