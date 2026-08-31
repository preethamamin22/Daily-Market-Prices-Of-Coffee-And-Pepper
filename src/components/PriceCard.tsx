"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Minus, MapPin, Calendar, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import Link from "next/link";
import { SparklineChart } from "@/components/SparklineChart";

interface PriceCardProps {
    commodity: string;
    district: string;
    price: number;
    unit: string;
    date: string | Date;
    previousPrice?: number;
    sparklineData?: number[];
}

export function PriceCard({ commodity, district, price, unit, date, previousPrice, sparklineData }: PriceCardProps) {
    const diff = previousPrice ? price - previousPrice : 0;
    const pctChange = previousPrice && previousPrice > 0 ? ((diff / previousPrice) * 100).toFixed(1) : "0.0";
    const trend = previousPrice ? (price > previousPrice ? "up" : price < previousPrice ? "down" : "steady") : "steady";
    const formattedCommodity = commodity.replace("_", " ");

    const isCoffee = commodity.includes("COFFEE");
    const categoryBadge = isCoffee ? "Coffee Market" : "Spice Market";

    return (
        <motion.div
            layout
            whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
            whileTap={{ scale: 0.98 }}
            className="group"
        >
            <Card className="relative overflow-hidden border border-[#1e2d4a] bg-[#111a2e] backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl hover:border-emerald-500/50 transition-all duration-300">
                {/* Glowing top accent line */}
                <div className={`h-1.5 w-full ${
                    trend === "up" ? "bg-emerald-400 shadow-sm shadow-emerald-400" : trend === "down" ? "bg-rose-500" : "bg-emerald-500/40"
                }`} />

                <CardContent className="p-5 sm:p-6">
                    {/* Header Row */}
                    <div className="flex justify-between items-start gap-2 mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-emerald-400" />
                                    {district}
                                </span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                    {categoryBadge}
                                </span>
                            </div>
                            <h3 className="text-xl font-black capitalize tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                                {formattedCommodity.toLowerCase()}
                            </h3>
                        </div>

                        <div className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-xs border ${
                            trend === "up" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" :
                            trend === "down" ? "bg-rose-500/15 text-rose-400 border-rose-500/30" :
                            "bg-slate-800 text-slate-300 border-slate-700"
                        }`}>
                            {trend === "up" && <ArrowUpRight className="h-3.5 w-3.5" />}
                            {trend === "down" && <ArrowDownRight className="h-3.5 w-3.5" />}
                            {trend === "steady" && <Minus className="h-3.5 w-3.5" />}
                            <span>{trend === "steady" ? "Steady" : `${diff > 0 ? "+" : ""}${pctChange}%`}</span>
                        </div>
                    </div>

                    {/* Price display */}
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                            ₹{price.toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-slate-400 uppercase">
                            / {unit}
                        </span>
                    </div>

                    {/* Sparkline mini trend chart */}
                    <div className="mb-4 pt-1 pb-1 bg-[#090e1a]/40 rounded-xl p-1 border border-white/5">
                        <SparklineChart isUp={trend !== "down"} data={sparklineData} height={42} />
                    </div>

                    {/* Footer bar */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#1e2d4a]">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold">
                            <Calendar className="h-3 w-3 text-emerald-400/80" />
                            {format(new Date(date), "dd MMM, yyyy")}
                        </div>
                        <Link
                            href={`/history?commodity=${commodity}&district=${district}`}
                            className="text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 group-hover:underline flex items-center gap-1"
                        >
                            <span>Analyze</span>
                            <ExternalLink className="h-3 w-3" />
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
