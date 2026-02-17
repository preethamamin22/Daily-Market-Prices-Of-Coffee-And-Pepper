import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLatestPrices } from "@/lib/price-service";
import { COMMODITIES, DISTRICTS } from "@/lib/constants";

export default async function Home() {
    const prices = await getLatestPrices();

    // Group prices by district
    const kodaguPrices = prices.filter((p) => p.district === DISTRICTS.KODAGU);
    const hassanPrices = prices.filter((p) => p.district === DISTRICTS.HASSAN);

    return (
        <div className="container py-8 space-y-8">
            <section className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center text-primary">
                    Daily Market Prices
                </h1>
                <p className="text-center text-muted-foreground max-w-2xl mx-auto">
                    Current coffee and pepper rates for Kodagu and Hassan districts. Updated daily from market sources.
                </p>
            </section>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Kodagu Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-semibold tracking-tight">{DISTRICTS.KODAGU}</h2>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                            Live
                        </span>
                    </div>
                    <div className="grid gap-4">
                        {kodaguPrices.map((price, idx) => (
                            <PriceCard key={idx} data={price} />
                        ))}
                        {kodaguPrices.length === 0 && <NoDataCard />}
                    </div>
                </section>

                {/* Hassan Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-semibold tracking-tight">{DISTRICTS.HASSAN}</h2>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                            Live
                        </span>
                    </div>
                    <div className="grid gap-4">
                        {hassanPrices.map((price, idx) => (
                            <PriceCard key={idx} data={price} />
                        ))}
                        {hassanPrices.length === 0 && <NoDataCard />}
                    </div>
                </section>
            </div>
        </div>
    );
}

function PriceCard({ data }: { data: any }) {
    const isCoffee = data.commodity.includes("Coffee");
    return (
        <Card className="overflow-hidden border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2 bg-muted/20">
                <CardTitle className="flex justify-between items-start">
                    <span>{data.commodity}</span>
                    <span className="text-2xl font-bold text-primary">
                        ₹{data.price.toLocaleString()}
                    </span>
                </CardTitle>
                <CardDescription>
                    Per {data.unit} • {new Date(data.date).toLocaleDateString()}
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 text-sm text-muted-foreground flex justify-between items-center bg-card/50">
                <span>Source: {data.source || "Market"}</span>
                <span className="text-xs uppercase tracking-wider font-semibold opacity-70">
                    {isCoffee ? "☕ Plantation" : "🌶️ Spice"}
                </span>
            </CardContent>
        </Card>
    );
}

function NoDataCard() {
    return (
        <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-6 text-muted-foreground">
                <p>No price data available for today.</p>
            </CardContent>
        </Card>
    );
}
