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
            whileHover={{ y: -5, transition: { duration: 0.25, ease: "easeOut" } }}
            whileTap={{ scale: 0.98 }}
            className="group"
        >
            <Card className="relative overflow-hidden border border-slate-200/90 bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(15,23,42,0.06)] hover:shadow-xl hover:border-emerald-600/40 transition-all duration-300">
                {/* Top accent bar */}
                <div className={`h-1.5 w-full ${
                    trend === "up" ? "bg-emerald-600" : trend === "down" ? "bg-rose-500" : "bg-emerald-600/30"
                }`} />

                <CardContent className="p-5 sm:p-6">
                    {/* Header Row */}
                    <div className="flex justify-between items-start gap-2 mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-emerald-600" />
                                    {district}
                                </span>
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                                    {categoryBadge}
                                </span>
                            </div>
                            <h3 className="text-xl font-black capitalize tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                                {formattedCommodity.toLowerCase()}
                            </h3>
                        </div>

                        <div className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-xs border ${
                            trend === "up" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                            trend === "down" ? "bg-rose-50 text-rose-700 border-rose-200" :
                            "bg-slate-100 text-slate-600 border-slate-200"
                        }`}>
                            {trend === "up" && <ArrowUpRight className="h-3.5 w-3.5" />}
                            {trend === "down" && <ArrowDownRight className="h-3.5 w-3.5" />}
                            {trend === "steady" && <Minus className="h-3.5 w-3.5" />}
                            <span>{trend === "steady" ? "Steady" : `${diff > 0 ? "+" : ""}${pctChange}%`}</span>
                        </div>
                    </div>

                    {/* Price display */}
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                            ₹{price.toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-slate-500 uppercase">
                            / {unit}
                        </span>
                    </div>

                    {/* Sparkline mini trend chart */}
                    <div className="mb-4 pt-1 pb-1 bg-slate-50 rounded-xl p-1 border border-slate-100">
                        <SparklineChart isUp={trend !== "down"} data={sparklineData} height={42} />
                    </div>

                    {/* Footer bar */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold">
                            <Calendar className="h-3 w-3 text-emerald-600" />
                            {format(new Date(date), "dd MMM, yyyy")}
                        </div>
                        <Link
                            href={`/history?commodity=${commodity}&district=${district}`}
                            className="text-[10px] font-black uppercase tracking-widest text-emerald-700 hover:text-emerald-800 group-hover:underline flex items-center gap-1"
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
