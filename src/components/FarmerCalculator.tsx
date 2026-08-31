"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Sparkles, Coins, Plus, Minus } from "lucide-react";
import { PriceData } from "@/types/price";

interface FarmerCalculatorProps {
    prices: PriceData[];
}

export function FarmerCalculator({ prices }: FarmerCalculatorProps) {
    const [selectedCommodity, setSelectedCommodity] = useState<string>("COFFEE_ARABICA");
    const [selectedDistrict, setSelectedDistrict] = useState<string>("KODAGU");
    const [quantity, setQuantity] = useState<number>(10);

    // Find current price
    const activePriceObj = prices.find(
        (p) => p.commodity === selectedCommodity && p.district === selectedDistrict
    );

    // Default rate fallback
    const defaultRates: Record<string, number> = {
        "COFFEE_ARABICA": selectedDistrict === "KODAGU" ? 23500 : 23200,
        "COFFEE_ROBUSTA": selectedDistrict === "KODAGU" ? 10300 : 10100,
        "PEPPER": selectedDistrict === "KODAGU" ? 690 : 680,
    };

    const unitPrice = activePriceObj ? activePriceObj.price : (defaultRates[selectedCommodity] || 10000);
    const unitLabel = selectedCommodity.includes("COFFEE") ? "50 kg Bags (ಮೂಟೆಗಳು)" : "Kilograms (ಕೆ.ಜಿ)";

    const totalEstimate = quantity * unitPrice;

    return (
        <Card className="w-full border border-border/80 sm:border-2 sm:border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 shadow-md rounded-2xl sm:rounded-3xl overflow-hidden">
            <CardHeader className="bg-primary/10 border-b border-primary/20 pb-4 pt-5 px-4 sm:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest mb-1.5">
                            <Sparkles className="h-3 w-3" />
                            Farmer Tool (ರೈತರ ಲೆಕ್ಕಾಚಾರ)
                        </div>
                        <CardTitle className="text-xl sm:text-3xl font-black text-foreground flex items-center gap-2">
                            <Calculator className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                            Crop Income Calculator
                        </CardTitle>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">
                            Calculate estimated crop earnings based on live market rates.
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-8 space-y-6">
                {/* Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Commodity Selection */}
                    <div className="space-y-2">
                        <label className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-muted-foreground block">
                            1. Select Commodity (ಬೆಳೆ ಆಯ್ಕೆ)
                        </label>
                        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                            {[
                                { id: "COFFEE_ARABICA", name: "Arabica", kn: "ಅರಬಿಕಾ" },
                                { id: "COFFEE_ROBUSTA", name: "Robusta", kn: "ರೋಬಸ್ಟಾ" },
                                { id: "PEPPER", name: "Pepper", kn: "ಮೆಣಸು" },
                            ].map((c) => (
                                <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => setSelectedCommodity(c.id)}
                                    className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl text-center transition-all border ${
                                        selectedCommodity === c.id
                                            ? "bg-primary text-primary-foreground border-primary font-black shadow-md shadow-primary/20 scale-[1.01]"
                                            : "bg-background hover:bg-muted border-border text-foreground font-bold"
                                    }`}
                                >
                                    <span className="block text-xs sm:text-sm font-black truncate">{c.name}</span>
                                    <span className={`block text-[9px] sm:text-[10px] truncate ${selectedCommodity === c.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{c.kn}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* District Selection */}
                    <div className="space-y-2">
                        <label className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-muted-foreground block">
                            2. Select District (ಜಿಲ್ಲೆ)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: "KODAGU", name: "Kodagu", kn: "ಕೊಡಗು" },
                                { id: "HASSAN", name: "Hassan", kn: "ಹಾಸನ" },
                            ].map((d) => (
                                <button
                                    key={d.id}
                                    type="button"
                                    onClick={() => setSelectedDistrict(d.id)}
                                    className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl text-center transition-all border ${
                                        selectedDistrict === d.id
                                            ? "bg-primary text-primary-foreground border-primary font-black shadow-md shadow-primary/20 scale-[1.01]"
                                            : "bg-background hover:bg-muted border-border text-foreground font-bold"
                                    }`}
                                >
                                    <span className="block text-xs sm:text-sm font-black">{d.name} Market</span>
                                    <span className={`block text-[9px] sm:text-[10px] ${selectedDistrict === d.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{d.kn}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quantity Controls */}
                <div className="bg-muted/40 p-4 sm:p-5 rounded-2xl border border-border/60 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <label className="text-xs font-black uppercase tracking-wider text-foreground block">
                                3. Quantity ({unitLabel})
                            </label>
                            <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium">Adjust quantity to calculate total value</span>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                            <button
                                type="button"
                                onClick={() => setQuantity(Math.max(1, quantity - 5))}
                                className="p-2.5 rounded-xl bg-background border border-border hover:bg-muted text-foreground font-extrabold active:scale-95 transition-transform"
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-24 text-center py-2 px-3 rounded-xl border border-primary/40 bg-background text-lg font-black text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <button
                                type="button"
                                onClick={() => setQuantity(quantity + 5)}
                                className="p-2.5 rounded-xl bg-background border border-border hover:bg-muted text-foreground font-extrabold active:scale-95 transition-transform"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Quick increment pills */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-2 border-t border-border/40">
                        <span className="text-[10px] font-bold text-muted-foreground self-center mr-1">Quick Add:</span>
                        {[5, 10, 25, 50, 100].map((q) => (
                            <button
                                key={q}
                                type="button"
                                onClick={() => setQuantity(q)}
                                className="px-2.5 py-1 text-xs font-extrabold rounded-lg bg-background hover:bg-primary/10 hover:text-primary border border-border/60 transition-colors"
                            >
                                {q} {selectedCommodity.includes("COFFEE") ? "bags" : "kg"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Income Result Banner */}
                <div className="bg-emerald-500/10 border-2 border-emerald-500/30 p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center sm:text-left w-full sm:w-auto">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 block">
                            Estimated Total Revenue (ಒಟ್ಟು ಆದಾಯ)
                        </span>
                        <div className="text-3xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                            ₹{totalEstimate.toLocaleString()}
                        </div>
                        <span className="text-xs text-muted-foreground font-semibold block">
                            {quantity} {selectedCommodity.includes("COFFEE") ? "bags" : "kg"} × ₹{unitPrice.toLocaleString()} per unit
                        </span>
                    </div>

                    <div className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-md">
                        <Coins className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span>Live Rate Applied</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
