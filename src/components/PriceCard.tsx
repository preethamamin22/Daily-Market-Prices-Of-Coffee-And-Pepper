import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon, TrendingUp } from "lucide-react";
import { format } from "date-fns";

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
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-primary/50">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{district}</p>
                        <CardTitle className="text-xl font-bold mt-1 capitalize">{formattedCommodity.toLowerCase()}</CardTitle>
                    </div>
                    {commodity.includes("COFFEE") ? (
                        <div className="bg-amber-100 text-amber-800 p-2 rounded-full dark:bg-amber-900/30 dark:text-amber-400">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                    ) : (
                        <div className="bg-green-100 text-green-800 p-2 rounded-full dark:bg-green-900/30 dark:text-green-400">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold">₹{price.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">/ {unit}</span>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                        {trend === "up" && <ArrowUpIcon className="h-4 w-4 text-green-500" />}
                        {trend === "down" && <ArrowDownIcon className="h-4 w-4 text-red-500" />}
                        {trend === "steady" && <MinusIcon className="h-4 w-4 text-gray-500" />}
                        <span className={trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-500"}>
                            {trend === "up" ? "Up" : trend === "down" ? "Down" : "Steady"}
                        </span>
                    </div>

                    <a
                        href={`/history?commodity=${commodity}&district=${district}`}
                        className="text-primary hover:underline text-xs font-semibold flex items-center gap-1"
                    >
                        View History →
                    </a>
                </div>

                <div className="mt-2 text-right">
                    <span className="text-[10px] text-muted-foreground">
                        Updated: {format(new Date(date), "dd MMM, h:mm a")}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
