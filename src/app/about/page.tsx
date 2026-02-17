import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, TrendingUp, Users, Bell } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-muted/10 pb-10">
            <Header />

            <main className="container px-4 py-8 max-w-4xl">
                <div className="text-center mb-10 space-y-2">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">About Us</h1>
                    <p className="text-muted-foreground text-lg">
                        Your trusted source for daily coffee and pepper market prices
                    </p>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Coffee className="h-5 w-5 text-primary" />
                                Our Mission
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground">
                            <p>
                                We provide accurate, up-to-date pricing information for coffee and pepper commodities
                                in the Kodagu and Hassan districts of Karnataka. Our platform helps farmers, traders,
                                and buyers make informed decisions by offering transparent market data.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                What We Track
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span><strong>Coffee (Arabica & Robusta)</strong> - Daily market rates from Kodagu and Hassan</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span><strong>Black Pepper</strong> - Current pricing trends and historical data</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span><strong>Price Trends</strong> - Track daily changes and market movements</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                Who We Serve
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-4 text-center">
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <h3 className="font-semibold mb-2">Farmers</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Get fair market prices for your produce
                                    </p>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <h3 className="font-semibold mb-2">Traders</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Make informed buying and selling decisions
                                    </p>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <h3 className="font-semibold mb-2">Buyers</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Access transparent pricing information
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-primary" />
                                Data Sources
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground">
                            <p>
                                Our prices are sourced from official government agricultural market boards,
                                commodity exchanges, and verified local market data. We update our platform daily
                                to ensure you have access to the most current information.
                            </p>
                        </CardContent>
                    </Card>

                    <div className="text-center pt-6 text-sm text-muted-foreground border-t">
                        <p>For inquiries or to report data issues, please contact the administrator.</p>
                        <p className="mt-2">© {new Date().getFullYear()} Coffee & Pepper Price Tracker. All rights reserved.</p>
                        <p className="mt-2 italic">
                            Created by <a href="https://preethamamin.framer.website/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnq-FqHd1jwdFPLLgbiSYlb5GsSm_Nt8tmSURFDa-tZouVfp3OU5oTTpKa6_k_aem_cKoKzXCgHGODmRRcwMolOw" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-primary transition-colors not-italic">Preetham Amin</a>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
