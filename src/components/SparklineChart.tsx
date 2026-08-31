"use client";

import { useEffect, useState } from "react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

interface SparklineChartProps {
    data?: number[];
    isUp?: boolean;
    height?: number;
}

export function SparklineChart({ data, isUp = true, height = 48 }: SparklineChartProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Generate fallback trend if data not supplied
    const chartPoints = data && data.length >= 3 
        ? data.map((price, idx) => ({ idx, price }))
        : [
            { idx: 0, price: isUp ? 100 : 110 },
            { idx: 1, price: isUp ? 102 : 107 },
            { idx: 2, price: isUp ? 101 : 108 },
            { idx: 3, price: isUp ? 105 : 104 },
            { idx: 4, price: isUp ? 104 : 105 },
            { idx: 5, price: isUp ? 108 : 102 },
            { idx: 6, price: isUp ? 112 : 100 },
        ];

    const strokeColor = isUp ? "#10b981" : "#f43f5e";
    const gradientId = `sparkline-grad-${isUp ? "up" : "down"}-${Math.random().toString(36).substring(2, 7)}`;

    if (!mounted) {
        return <div style={{ height }} className="w-full bg-muted/20 animate-pulse rounded-lg" />;
    }

    return (
        <div style={{ height }} className="w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartPoints} margin={{ top: 4, right: 2, bottom: 4, left: 2 }}>
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.35} />
                            <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
                        </linearGradient>
                    </defs>
                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke={strokeColor}
                        strokeWidth={2}
                        fill={`url(#${gradientId})`}
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
