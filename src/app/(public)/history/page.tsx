import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLatestPrices } from "@/lib/price-service";

export default async function HistoryPage() {
    const prices = await getLatestPrices(); // In reality this would fetch historical data

    return (
        <div className="container py-8 space-y-8">
            <section className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">Price History</h1>
                <p className="text-muted-foreground">
                    Historical price trends for the last 30 days.
                </p>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Records</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Commodity</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">District</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Price</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {prices.map((price, idx) => (
                                    <tr key={idx} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle">{new Date(price.date).toLocaleDateString()}</td>
                                        <td className="p-4 align-middle font-medium">{price.commodity}</td>
                                        <td className="p-4 align-middle">{price.district}</td>
                                        <td className="p-4 align-middle text-right">₹{price.price.toLocaleString()} / {price.unit}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
