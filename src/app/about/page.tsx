import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, TrendingUp, Users, ShieldCheck, Heart, MapPin, Sparkles } from "lucide-react";
import { SmoothWrapper } from "@/components/SmoothWrapper";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
            <Header />

            <SmoothWrapper>
                <main className="container px-4 sm:px-6 py-8 sm:py-14 max-w-4xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-3 max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
                            <Sparkles className="h-3.5 w-3.5" />
                            About Malnad Commodity Hub
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
                            Empowering Local Coffee & Pepper Growers
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground font-medium">
                            Your verified daily source for Coffee Arabica, Robusta & Black Pepper market rates in Kodagu & Hassan.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Our Mission */}
                        <Card className="border border-border/70 bg-card/90 backdrop-blur-lg shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden">
                            <CardHeader className="pb-3 border-b border-border/40 bg-muted/20 px-6 pt-6">
                                <CardTitle className="text-lg font-black text-foreground flex items-center gap-2.5">
                                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                        <Coffee className="h-5 w-5" />
                                    </div>
                                    Our Mission (ನಮ್ಮ ಧ್ಯೇಯ)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 text-sm text-muted-foreground font-medium leading-relaxed">
                                <p>
                                    We provide transparent, real-time daily pricing information for Coffee Arabica, Coffee Robusta, and Black Pepper commodities produced across the Malnad region — covering Kodagu (Madikeri, Virajpet, Somwarpet) and Hassan (Sakleshpur, Belur, Alur) districts.
                                </p>
                            </CardContent>
                        </Card>

                        {/* What We Track */}
                        <Card className="border border-border/70 bg-card/90 backdrop-blur-lg shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden">
                            <CardHeader className="pb-3 border-b border-border/40 bg-muted/20 px-6 pt-6">
                                <CardTitle className="text-lg font-black text-foreground flex items-center gap-2.5">
                                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                        <TrendingUp className="h-5 w-5" />
                                    </div>
                                    Key Commodities Tracked
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm font-medium">
                                    <li className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-1">
                                        <span className="font-black text-foreground block">Coffee Arabica</span>
                                        <span className="text-xs text-muted-foreground block">50 kg Parchment & Cherry rates</span>
                                    </li>
                                    <li className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-1">
                                        <span className="font-black text-foreground block">Coffee Robusta</span>
                                        <span className="text-xs text-muted-foreground block">50 kg Parchment & Cherry rates</span>
                                    </li>
                                    <li className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-1">
                                        <span className="font-black text-foreground block">Black Pepper</span>
                                        <span className="text-xs text-muted-foreground block">Per Kilogram market closing price</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Who We Serve */}
                        <Card className="border border-border/70 bg-card/90 backdrop-blur-lg shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden">
                            <CardHeader className="pb-3 border-b border-border/40 bg-muted/20 px-6 pt-6">
                                <CardTitle className="text-lg font-black text-foreground flex items-center gap-2.5">
                                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    Who We Serve
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                                    <div className="p-5 rounded-2xl bg-muted/40 border border-border/40 space-y-2">
                                        <h3 className="font-black text-foreground text-base">Planters & Farmers</h3>
                                        <p className="text-xs text-muted-foreground font-medium">
                                            Get fair market benchmarks before selling your harvest.
                                        </p>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-muted/40 border border-border/40 space-y-2">
                                        <h3 className="font-black text-foreground text-base">Traders & Brokers</h3>
                                        <p className="text-xs text-muted-foreground font-medium">
                                            Track historical range volatility and daily market movements.
                                        </p>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-muted/40 border border-border/40 space-y-2">
                                        <h3 className="font-black text-foreground text-base">Exporters & Buyers</h3>
                                        <p className="text-xs text-muted-foreground font-medium">
                                            Access verified regional district pricing records.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Developer & Footer note */}
                        <div className="text-center pt-8 border-t border-border/50 text-xs text-muted-foreground font-medium space-y-2">
                            <p>© {new Date().getFullYear()} Malnad Commodity Exchange. All rights reserved.</p>
                            <p className="font-bold text-foreground">
                                Developed with <Heart className="h-3.5 w-3.5 text-rose-500 inline mx-0.5" /> by{" "}
                                <a
                                    href="https://preethamamin.vercel.app/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                >
                                    Preetham Amin
                                </a>
                            </p>
                        </div>
                    </div>
                </main>
            </SmoothWrapper>
        </div>
    );
}
