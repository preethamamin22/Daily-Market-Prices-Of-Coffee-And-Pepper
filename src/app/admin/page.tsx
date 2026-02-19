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

import { SmoothWrapper } from "@/components/SmoothWrapper";

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
        <div className="min-h-screen bg-background">
            <Header />
            <SmoothWrapper>
                <main className="container py-12 px-6 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30">Administrative Terminal</p>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-primary">Master Dashboard</h1>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="bg-primary/5 border border-primary/10 text-primary px-5 py-3 rounded-2xl flex items-center gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                <span className="text-[11px] font-black uppercase tracking-wider">
                                    Operator: {(session.user as { name?: string | null }).name || "Admin"}
                                </span>
                            </div>
                            <SyncPricesButton />
                            <Link href="/admin/users">
                                <Button variant="outline" className="rounded-xl border-border py-6 px-6 text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all">User Analytics</Button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid gap-10 md:grid-cols-2">
                        <Card className="border-border shadow-sm rounded-3xl overflow-hidden bg-card/50">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-lg font-bold tracking-tight text-primary">Add New Price Entry</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 pt-0">
                                <form action={addPrice} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <Label htmlFor="commodity" className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Commodity</Label>
                                            <select id="commodity" name="commodity" className="flex h-12 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm font-bold tracking-tight transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none appearance-none" required>
                                                <option value="COFFEE_ARABICA">Coffee Arabica</option>
                                                <option value="COFFEE_ROBUSTA">Coffee Robusta</option>
                                                <option value="PEPPER">Pepper</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="district" className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">District</Label>
                                            <select id="district" name="district" className="flex h-12 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm font-bold tracking-tight transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none appearance-none" required>
                                                <option value="KODAGU">Kodagu</option>
                                                <option value="HASSAN">Hassan</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <Label htmlFor="price" className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Price</Label>
                                            <Input id="price" name="price" type="number" step="0.01" required placeholder="0.00" className="h-12 rounded-xl border-border bg-background font-bold px-4" />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="unit" className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Unit</Label>
                                            <select id="unit" name="unit" className="flex h-12 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm font-bold tracking-tight transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none appearance-none" required>
                                                <option value="50KG">50 KG</option>
                                                <option value="KG">1 KG</option>
                                                <option value="QUINTAL">Quintal</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="source" className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Source (Optional)</Label>
                                        <Input id="source" name="source" placeholder="Market, APMC, etc." className="h-12 rounded-xl border-border bg-background font-bold px-4" />
                                    </div>

                                    <Button type="submit" className="w-full py-7 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary/20 mt-4">Record New Price</Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card className="border-border shadow-sm rounded-3xl overflow-hidden bg-card/50">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-lg font-bold tracking-tight text-primary">Recent Terminal Records</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 pt-0">
                                <div className="rounded-2xl border border-border overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-border bg-primary/5">
                                                <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-primary/60">Date</th>
                                                <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-primary/60">Commodity</th>
                                                <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-primary/60">Value</th>
                                                <th className="p-4 text-right text-[10px] font-black uppercase tracking-widest text-primary/60">Sector</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentPrices.map((p) => (
                                                <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-primary/5 transition-all">
                                                    <td className="p-4 text-[11px] font-bold text-foreground/40">{p.date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                                                    <td className="p-4 text-[11px] font-black uppercase tracking-tighter text-primary">{p.commodity.replace("_", " ")}</td>
                                                    <td className="p-4 text-[11px] font-black">₹{p.price.toLocaleString()} <span className="text-[9px] text-foreground/40">/ {p.unit}</span></td>
                                                    <td className="p-4 text-right text-[10px] font-black uppercase text-foreground/30">{p.district}</td>
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
            </SmoothWrapper>
        </div>
    );
}
