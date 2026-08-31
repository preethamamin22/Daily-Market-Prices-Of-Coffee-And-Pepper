"use client";

import { useState, useEffect, useMemo } from "react";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    LineChart,
    Line,
    BarChart,
    Bar,
    ReferenceLine
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HistoryData } from "@/types/price";
import { AreaChart as AreaIcon, TrendingUp, Calendar, Zap, Layers, BarChart2 } from "lucide-react";

interface PriceChartProps {
    data: HistoryData[];
    title: string;
    commodity: string;
    district: string;
    onDaysChange?: (days: number) => void;
    currentDays?: number;
}

export function PriceChart({ data, title, district, commodity }: PriceChartProps) {
    const [mounted, setMounted] = useState(false);
    const [chartType, setChartType] = useState<"area" | "line" | "bar">("area");
    const [timeframe, setTimeframe] = useState<number>(30);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Filter data based on selected timeframe
    const filteredData = useMemo(() => {
        if (!data || data.length === 0) return [];
        return data.slice(-timeframe);
    }, [data, timeframe]);

    // Calculate metrics
    const metrics = useMemo(() => {
        if (!filteredData || filteredData.length === 0) {
            return { high: 0, low: 0, avg: 0, latest: 0, change: 0, pctChange: 0, isPositive: true };
        }

        const prices = filteredData.map((d) => d.price);
        const high = Math.max(...prices);
        const low = Math.min(...prices);
        const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
        const first = prices[0];
        const latest = prices[prices.length - 1];
        const change = latest - first;
        const pctChange = first > 0 ? Number(((change / first) * 100).toFixed(2)) : 0;

        return {
            high,
            low,
            avg,
            latest,
            change,
            pctChange,
            isPositive: change >= 0
        };
    }, [filteredData]);

    const isCoffee = commodity.includes("COFFEE");
    const themeColor = isCoffee 
        ? (commodity.includes("ARABICA") ? "#059669" : "#0284c7")
        : "#d97706";

    const formattedCommodityName = commodity.replace("_", " ");

    if (!mounted) {
        return (
            <Card className="h-[450px] w-full flex flex-col items-center justify-center border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 text-muted-foreground animate-pulse">
                    <Zap className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold">Initializing Market Chart Engine...</span>
                </div>
            </Card>
        );
    }

    if (!filteredData || filteredData.length === 0) {
        return (
            <Card className="h-[450px] w-full flex flex-col items-center justify-center border border-dashed border-border/80 bg-card rounded-2xl p-6 text-center shadow-sm">
                <div className="h-12 w-12 rounded-full bg-muted/60 flex items-center justify-center mb-3">
                    <TrendingUp className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-base font-bold text-foreground">No historical records found</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                    Select another commodity or district to view analytics.
                </p>
            </Card>
        );
    }

    return (
        <Card className="w-full shadow-lg border border-border/60 bg-card/95 backdrop-blur-xl rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-border/40 pb-5 pt-6 px-6 sm:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                                {district} Sector
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                Market Analytics
                            </span>
                        </div>
                        <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
                            {formattedCommodityName}
                        </CardTitle>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Timeframe Controls */}
                        <div className="flex items-center bg-muted/70 p-1 rounded-xl border border-border/50">
                            {[
                                { label: "7D", value: 7 },
                                { label: "30D", value: 30 },
                                { label: "90D", value: 90 },
                                { label: "1Y", value: 365 },
                            ].map((item) => (
                                <button
                                    key={item.value}
                                    onClick={() => setTimeframe(item.value)}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                                        timeframe === item.value
                                            ? "bg-background text-foreground shadow-sm font-extrabold"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* Chart Type Toggle */}
                        <div className="flex items-center bg-muted/70 p-1 rounded-xl border border-border/50">
                            <button
                                onClick={() => setChartType("area")}
                                title="Area Chart"
                                className={`p-1.5 rounded-lg transition-all ${
                                    chartType === "area" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                <AreaIcon className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setChartType("line")}
                                title="Line Chart"
                                className={`p-1.5 rounded-lg transition-all ${
                                    chartType === "line" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                <TrendingUp className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setChartType("bar")}
                                title="Bar Chart"
                                className={`p-1.5 rounded-lg transition-all ${
                                    chartType === "bar" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                <BarChart2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Metric Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-border/30">
                    <div className="bg-muted/40 p-3 rounded-xl border border-border/40">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block mb-0.5">Current Rate</span>
                        <span className="text-xl sm:text-2xl font-black text-foreground">₹{metrics.latest.toLocaleString()}</span>
                    </div>
                    <div className="bg-muted/40 p-3 rounded-xl border border-border/40">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block mb-0.5">Period Change</span>
                        <div className="flex items-center gap-1">
                            <span className={`text-lg sm:text-xl font-black ${metrics.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                                {metrics.isPositive ? "+" : ""}{metrics.pctChange}%
                            </span>
                        </div>
                    </div>
                    <div className="bg-muted/40 p-3 rounded-xl border border-border/40">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block mb-0.5">Peak Price</span>
                        <span className="text-xl sm:text-2xl font-black text-foreground">₹{metrics.high.toLocaleString()}</span>
                    </div>
                    <div className="bg-muted/40 p-3 rounded-xl border border-border/40">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block mb-0.5">Average Rate</span>
                        <span className="text-xl sm:text-2xl font-black text-primary">₹{metrics.avg.toLocaleString()}</span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6 sm:p-8">
                <div className="h-[360px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === "area" ? (
                            <AreaChart data={filteredData} margin={{ top: 15, right: 10, left: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={themeColor} stopOpacity={0.4} />
                                        <stop offset="95%" stopColor={themeColor} stopOpacity={0.01} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(150, 150, 150, 0.15)" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
                                    tickLine={false}
                                    axisLine={{ stroke: "rgba(150, 150, 150, 0.2)" }}
                                    dy={10}
                                />
                                <YAxis
                                    domain={['auto', 'auto']}
                                    tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val: number) => `₹${val.toLocaleString()}`}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "12px",
                                        border: "1px solid rgba(150,150,150,0.2)",
                                        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)",
                                        backgroundColor: "#0f172a",
                                        color: "#fff",
                                        fontSize: "13px",
                                        fontWeight: "600",
                                        padding: "10px 14px",
                                    }}
                                    formatter={(val: number | string | undefined) => [
                                        `₹${Number(val || 0).toLocaleString()}`,
                                        "Market Price"
                                    ]}
                                    labelStyle={{ color: "#94a3b8", fontSize: "11px", marginBottom: "4px" }}
                                />
                                <ReferenceLine y={metrics.avg} stroke={themeColor} strokeDasharray="3 3" strokeOpacity={0.6} label={{ value: `Avg: ₹${metrics.avg}`, fill: themeColor, fontSize: 10, position: 'right' }} />
                                <Area
                                    type="monotone"
                                    dataKey="price"
                                    stroke={themeColor}
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorGradient)"
                                    animationDuration={1200}
                                    activeDot={{ r: 6, stroke: themeColor, strokeWidth: 2, fill: "#ffffff" }}
                                />
                            </AreaChart>
                        ) : chartType === "line" ? (
                            <LineChart data={filteredData} margin={{ top: 15, right: 10, left: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(150, 150, 150, 0.15)" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
                                    tickLine={false}
                                    axisLine={{ stroke: "rgba(150, 150, 150, 0.2)" }}
                                    dy={10}
                                />
                                <YAxis
                                    domain={['auto', 'auto']}
                                    tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val: number) => `₹${val.toLocaleString()}`}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "12px",
                                        border: "1px solid rgba(150,150,150,0.2)",
                                        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)",
                                        backgroundColor: "#0f172a",
                                        color: "#fff",
                                        fontSize: "13px",
                                        fontWeight: "600",
                                        padding: "10px 14px",
                                    }}
                                    formatter={(val: number | string | undefined) => [
                                        `₹${Number(val || 0).toLocaleString()}`,
                                        "Market Price"
                                    ]}
                                />
                                <ReferenceLine y={metrics.avg} stroke={themeColor} strokeDasharray="3 3" strokeOpacity={0.6} />
                                <Line
                                    type="monotone"
                                    dataKey="price"
                                    stroke={themeColor}
                                    strokeWidth={3}
                                    dot={{ r: 3, fill: themeColor }}
                                    activeDot={{ r: 6, stroke: themeColor, strokeWidth: 2, fill: "#ffffff" }}
                                />
                            </LineChart>
                        ) : (
                            <BarChart data={filteredData} margin={{ top: 15, right: 10, left: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(150, 150, 150, 0.15)" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
                                    tickLine={false}
                                    axisLine={{ stroke: "rgba(150, 150, 150, 0.2)" }}
                                    dy={10}
                                />
                                <YAxis
                                    domain={['auto', 'auto']}
                                    tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val: number) => `₹${val.toLocaleString()}`}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "12px",
                                        border: "1px solid rgba(150,150,150,0.2)",
                                        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)",
                                        backgroundColor: "#0f172a",
                                        color: "#fff",
                                        fontSize: "13px",
                                        fontWeight: "600",
                                        padding: "10px 14px",
                                    }}
                                    formatter={(val: number | string | undefined) => [
                                        `₹${Number(val || 0).toLocaleString()}`,
                                        "Market Price"
                                    ]}
                                />
                                <Bar dataKey="price" fill={themeColor} radius={[6, 6, 0, 0]} />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
