import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { SyncPricesButton } from "@/components/SyncPricesButton";

async function addPrice(formData: FormData) {
    "use server";

    const commodity = formData.get("commodity") as string;
    const district = formData.get("district") as string;
    const price = parseFloat(formData.get("price") as string);
    const unit = formData.get("unit") as string;
    const source = formData.get("source") as string;

    if (!commodity || !district || isNaN(price) || !unit) {
        return;
    }

    await prisma.dailyPrice.create({
        data: {
            commodity,
            district,
            price,
            unit,
            source: source || "Manual",
            date: new Date(),
        },
    });

    revalidatePath("/");
    revalidatePath("/admin");
}

export default async function AdminPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    // Fetch recent prices
    const recentPrices = await prisma.dailyPrice.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
    });

    return (
        <div className="min-h-screen bg-muted/10">
            <Header />
            <main className="container py-8 px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <SyncPricesButton />
                        <Link href="/admin/users">
                            <Button variant="outline">View User Analytics</Button>
                        </Link>
                        <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium">
                            Welcome, {(session.user as { name?: string | null }).name || "Admin"}
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Price</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form action={addPrice} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="commodity">Commodity</Label>
                                        <select id="commodity" name="commodity" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" required>
                                            <option value="COFFEE_ARABICA">Coffee Arabica</option>
                                            <option value="COFFEE_ROBUSTA">Coffee Robusta</option>
                                            <option value="PEPPER">Pepper</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="district">District</Label>
                                        <select id="district" name="district" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" required>
                                            <option value="KODAGU">Kodagu</option>
                                            <option value="HASSAN">Hassan</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price</Label>
                                        <Input id="price" name="price" type="number" step="0.01" required placeholder="0.00" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="unit">Unit</Label>
                                        <select id="unit" name="unit" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" required>
                                            <option value="50KG">50 KG</option>
                                            <option value="KG">1 KG</option>
                                            <option value="QUINTAL">Quintal</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="source">Source (Optional)</Label>
                                    <Input id="source" name="source" placeholder="Market, APMC, etc." />
                                </div>

                                <Button type="submit" className="w-full">Add Price</Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Entries</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="p-3 text-left font-medium">Date</th>
                                            <th className="p-3 text-left font-medium">Commodity</th>
                                            <th className="p-3 text-left font-medium">Price</th>
                                            <th className="p-3 text-right font-medium">District</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentPrices.map((p) => (
                                            <tr key={p.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                                                <td className="p-3">{p.date.toLocaleDateString()}</td>
                                                <td className="p-3 font-medium">{p.commodity.replace("_", " ")}</td>
                                                <td className="p-3">₹{p.price} / {p.unit}</td>
                                                <td className="p-3 text-right text-muted-foreground">{p.district}</td>
                                            </tr>
                                        ))}
                                        {recentPrices.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="p-4 text-center text-muted-foreground">No prices added yet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
