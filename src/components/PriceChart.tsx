"use client";

import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HistoryData } from "@/types/price";

interface PriceChartProps {
    data: HistoryData[];
    title: string;
    commodity: string;
    district: string;
}

export function PriceChart({ data, title, district }: PriceChartProps) {
    if (!data || data.length === 0) {
        return (
            <Card className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">No historical data available for this selection.</p>
            </Card>
        );
    }

    return (
        <Card className="w-full shadow-lg border-primary/10">
            <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center justify-between">
                    <span>{title}</span>
                    <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-1 rounded">
                        {district}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="oklch(0.6 0.12 150)" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="oklch(0.6 0.12 150)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.9 0.01 70)" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 10, fill: "oklch(0.4 0.05 45)", fontWeight: 700 }}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                tick={{ fontSize: 10, fill: "oklch(0.4 0.05 45)", fontWeight: 700 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value: number) => `₹${value}`}
                                dx={-10}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '12px',
                                    border: '1px solid oklch(0.9 0.01 70)',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                                    backgroundColor: 'white',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}
                                formatter={(value: number | string | undefined) => [`₹${value}`, 'Price']}
                            />
                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke="oklch(0.6 0.12 150)"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#colorPrice)"
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
