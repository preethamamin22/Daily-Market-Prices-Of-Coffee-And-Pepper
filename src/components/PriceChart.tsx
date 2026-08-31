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
import { AreaChart as AreaIcon, TrendingUp, Zap, BarChart2 } from "lucide-react";

interface PriceChartProps {
    data: HistoryData[];
    title: string;
    commodity: string;
    district: string;
}

export function PriceChart({ data, title, district, commodity }: PriceChartProps) {
    const [mounted, setMounted] = useState(false);
    const [chartType, setChartType] = useState<"area" | "line" | "bar">("area");
    const [timeframe, setTimeframe] = useState<number>(30);

    useEffect(() => {
        setMounted(true);
    }, []);

    const filteredData = useMemo(() => {
        if (!data || data.length === 0) return [];
        return data.slice(-timeframe);
    }, [data, timeframe]);

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

    const themeColor = "#047857";
    const formattedCommodityName = commodity.replace("_", " ");

    if (!mounted) {
        return (
            <Card className="h-[450px] w-full flex flex-col items-center justify-center border border-slate-200 bg-white rounded-2xl p-6 shadow-xs">
                <div className="flex items-center gap-3 text-slate-500 animate-pulse">
                    <Zap className="h-5 w-5 text-emerald-700" />
                    <span className="text-sm font-semibold">Loading Market Analytics Chart...</span>
                </div>
            </Card>
        );
    }

    if (!filteredData || filteredData.length === 0) {
        return (
            <Card className="h-[450px] w-full flex flex-col items-center justify-center border border-dashed border-slate-300 bg-white rounded-2xl p-6 text-center shadow-xs">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-500">
                    <TrendingUp className="h-6 w-6" />
                </div>
                <p className="text-base font-bold text-slate-900">No historical records found</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    Select another commodity or district to view analytics.
                </p>
            </Card>
        );
    }

    return (
        <Card className="w-full shadow-[0_4px_25px_-4px_rgba(15,23,42,0.06)] border border-slate-200 bg-white rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-200 pb-5 pt-6 px-6 sm:px-8 bg-slate-50/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-200">
                                {district} Sector
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Market Analytics
                            </span>
                        </div>
                        <CardTitle className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                            {formattedCommodityName}
                        </CardTitle>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Timeframe Controls */}
                        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
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
                                            ? "bg-white text-emerald-800 shadow-xs font-black"
                                            : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* Chart Type Toggle */}
                        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                            <button
                                onClick={() => setChartType("area")}
                                title="Area Chart"
                                className={`p-1.5 rounded-lg transition-all ${
                                    chartType === "area" ? "bg-white text-emerald-700 shadow-xs font-bold" : "text-slate-500 hover:text-slate-900"
                                }`}
                            >
                                <AreaIcon className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setChartType("line")}
                                title="Line Chart"
                                className={`p-1.5 rounded-lg transition-all ${
                                    chartType === "line" ? "bg-white text-emerald-700 shadow-xs font-bold" : "text-slate-500 hover:text-slate-900"
                                }`}
                            >
                                <TrendingUp className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setChartType("bar")}
                                title="Bar Chart"
                                className={`p-1.5 rounded-lg transition-all ${
                                    chartType === "bar" ? "bg-white text-emerald-700 shadow-xs font-bold" : "text-slate-500 hover:text-slate-900"
                                }`}
                            >
                                <BarChart2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Metric Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-200">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-0.5">Current Rate</span>
                        <span className="text-xl sm:text-2xl font-black text-slate-900">₹{metrics.latest.toLocaleString()}</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-0.5">Period Change</span>
                        <span className={`text-lg sm:text-xl font-black ${metrics.isPositive ? "text-emerald-700" : "text-rose-600"}`}>
                            {metrics.isPositive ? "+" : ""}{metrics.pctChange}%
                        </span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-0.5">Peak Price</span>
                        <span className="text-xl sm:text-2xl font-black text-slate-900">₹{metrics.high.toLocaleString()}</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-0.5">Average Rate</span>
                        <span className="text-xl sm:text-2xl font-black text-emerald-700">₹{metrics.avg.toLocaleString()}</span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6 sm:p-8">
                <div className="h-[340px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === "area" ? (
                            <AreaChart data={filteredData} margin={{ top: 15, right: 10, left: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={themeColor} stopOpacity={0.25} />
                                        <stop offset="95%" stopColor={themeColor} stopOpacity={0.01} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
                                    tickLine={false}
                                    axisLine={{ stroke: "#cbd5e1" }}
                                    dy={10}
                                />
                                <YAxis
                                    domain={['auto', 'auto']}
                                    tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val: number) => `₹${val.toLocaleString()}`}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "12px",
                                        border: "1px solid #e2e8f0",
                                        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.08)",
                                        backgroundColor: "#ffffff",
                                        color: "#0f172a",
                                        fontSize: "13px",
                                        fontWeight: "700",
                                        padding: "10px 14px",
                                    }}
                                    formatter={(val: number | string | undefined) => [
                                        `₹${Number(val || 0).toLocaleString()}`,
                                        "Market Price"
                                    ]}
                                    labelStyle={{ color: "#64748b", fontSize: "11px", marginBottom: "4px" }}
                                />
                                <ReferenceLine y={metrics.avg} stroke={themeColor} strokeDasharray="3 3" strokeOpacity={0.6} />
                                <Area
                                    type="monotone"
                                    dataKey="price"
                                    stroke={themeColor}
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorGradient)"
                                    animationDuration={1000}
                                    activeDot={{ r: 6, stroke: themeColor, strokeWidth: 2, fill: "#ffffff" }}
                                />
                            </AreaChart>
                        ) : chartType === "line" ? (
                            <LineChart data={filteredData} margin={{ top: 15, right: 10, left: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
                                    tickLine={false}
                                    axisLine={{ stroke: "#cbd5e1" }}
                                    dy={10}
                                />
                                <YAxis
                                    domain={['auto', 'auto']}
                                    tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val: number) => `₹${val.toLocaleString()}`}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "12px",
                                        border: "1px solid #e2e8f0",
                                        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.08)",
                                        backgroundColor: "#ffffff",
                                        color: "#0f172a",
                                        fontSize: "13px",
                                        fontWeight: "700",
                                        padding: "10px 14px",
                                    }}
                                    formatter={(val: number | string | undefined) => [
                                        `₹${Number(val || 0).toLocaleString()}`,
                                        "Market Price"
                                    ]}
                                />
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
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
                                    tickLine={false}
                                    axisLine={{ stroke: "#cbd5e1" }}
                                    dy={10}
                                />
                                <YAxis
                                    domain={['auto', 'auto']}
                                    tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val: number) => `₹${val.toLocaleString()}`}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "12px",
                                        border: "1px solid #e2e8f0",
                                        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.08)",
                                        backgroundColor: "#ffffff",
                                        color: "#0f172a",
                                        fontSize: "13px",
                                        fontWeight: "700",
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
