export const dynamic = 'force-dynamic';
import { Header } from "@/components/Header";
import { prisma } from "@/lib/db";
import { PriceChart } from "@/components/PriceChart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, Info } from "lucide-react";
import Link from "next/link";
import { startOfDay, subDays } from "date-fns";
import { PriceData, HistoryData } from "@/types/price";

async function getHistoryData(commodity: string, district: string, days: number = 30): Promise<HistoryData[]> {
    try {
        const startDate = startOfDay(subDays(new Date(), days));

        const entries = await prisma.dailyPrice.findMany({
            where: {
                commodity,
                district,
                date: {
                    gte: startDate,
                },
            },
            orderBy: {
                date: "asc",
            },
        }) as unknown as PriceData[];

        return entries.map((e) => ({
            date: e.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            price: e.price,
            timestamp: e.date.getTime(),
        }));
    } catch (error) {
        console.error("History Data Fetch Error:", error);
        return [];
    }
}

import { SmoothWrapper } from "@/components/SmoothWrapper";

export default async function HistoryPage(props: {
    searchParams: Promise<{ commodity?: string; district?: string }>;
}) {
    const searchParams = await props.searchParams;
    const commodity = searchParams.commodity || "COFFEE_ARABICA";
    const district = searchParams.district || "KODAGU";

    const data = await getHistoryData(commodity, district);

    return (
        <div className="min-h-screen bg-muted/10 pb-12 text-foreground">
            <Header />

            <SmoothWrapper>
                <main className="container px-4 py-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                <TrendingUp className="h-8 w-8 text-primary" />
                                Price Trends
                            </h1>
                            <p className="text-muted-foreground mt-1 text-lg">
                                Historical price data and analysis for the last 30 days.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar Filters */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg">Filter Data</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Commodity</label>
                                        <div className="flex flex-col gap-2">
                                            {["COFFEE_ARABICA", "COFFEE_ROBUSTA", "PEPPER"].map((c) => (
                                                <Link
                                                    key={c}
                                                    href={`/history?commodity=${c}&district=${district}`}
                                                    className={`text-sm px-4 py-2.5 rounded-lg transition-all duration-200 border ${commodity === c
                                                        ? "bg-primary text-primary-foreground shadow-md border-primary"
                                                        : "bg-white hover:bg-muted border-transparent"
                                                        }`}
                                                >
                                                    {c.replace("_", " ")}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">District</label>
                                        <div className="flex flex-col gap-2">
                                            {["KODAGU", "HASSAN"].map((d) => (
                                                <Link
                                                    key={d}
                                                    href={`/history?commodity=${commodity}&district=${d}`}
                                                    className={`text-sm px-4 py-2.5 rounded-lg transition-all duration-200 border ${district === d
                                                        ? "bg-primary text-primary-foreground shadow-md border-primary"
                                                        : "bg-white hover:bg-muted border-transparent"
                                                        }`}
                                                >
                                                    {d}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-primary/5 border-primary/10">
                                <CardContent className="pt-6 space-y-2">
                                    <div className="flex items-center gap-2 text-primary font-bold">
                                        <Info className="h-4 w-4" />
                                        <span>Did you know?</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Coffee prices in Kodagu often follow international market trends from Brazil and Vietnam, while local factors like monsoon affect Pepper yields.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Chart Section */}
                        <div className="lg:col-span-3">
                            <PriceChart
                                data={data}
                                title={`${commodity.replace("_", " ")} Trends`}
                                commodity={commodity}
                                district={district}
                            />

                            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card>
                                    <CardContent className="pt-6">
                                        <p className="text-sm text-muted-foreground">Highest Price</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            ₹{data.length > 0 ? Math.max(...data.map((d) => d.price)) : 0}
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6">
                                        <p className="text-sm text-muted-foreground">Lowest Price</p>
                                        <p className="text-2xl font-bold text-amber-600">
                                            ₹{data.length > 0 ? Math.min(...data.map((d) => d.price)) : 0}
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6">
                                        <p className="text-sm text-muted-foreground">Average Price</p>
                                        <p className="text-2xl font-bold">
                                            ₹{data.length > 0 ? (data.reduce((acc, curr) => acc + curr.price, 0) / data.length).toFixed(0) : 0}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>
            </SmoothWrapper>
        </div>
    );
}
