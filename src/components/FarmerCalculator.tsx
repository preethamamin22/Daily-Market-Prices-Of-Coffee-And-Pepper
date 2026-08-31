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

    const activePriceObj = prices.find(
        (p) => p.commodity === selectedCommodity && p.district === selectedDistrict
    );

    const defaultRates: Record<string, number> = {
        "COFFEE_ARABICA": selectedDistrict === "KODAGU" ? 23500 : 23200,
        "COFFEE_ROBUSTA": selectedDistrict === "KODAGU" ? 10300 : 10100,
        "PEPPER": selectedDistrict === "KODAGU" ? 690 : 680,
    };

    const unitPrice = activePriceObj ? activePriceObj.price : (defaultRates[selectedCommodity] || 10000);
    const unitLabel = selectedCommodity.includes("COFFEE") ? "50 kg Bags (ಮೂಟೆಗಳು)" : "Kilograms (ಕೆ.ಜಿ)";

    const totalEstimate = quantity * unitPrice;

    return (
        <Card className="w-full border border-slate-200 bg-white shadow-[0_4px_25px_-4px_rgba(15,23,42,0.06)] rounded-2xl sm:rounded-3xl overflow-hidden">
            <CardHeader className="bg-emerald-50/70 border-b border-emerald-100 pb-4 pt-5 px-4 sm:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest mb-1.5">
                            <Sparkles className="h-3 w-3" />
                            Farmer Quick Tool (ರೈತರ ಲೆಕ್ಕಾಚಾರ)
                        </div>
                        <CardTitle className="text-xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
                            <Calculator className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-700" />
                            Crop Income Calculator
                        </CardTitle>
                        <p className="text-xs text-slate-600 font-medium mt-0.5">
                            Calculate your estimated crop earnings based on today&apos;s live market rates.
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-8 space-y-6">
                {/* Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Commodity Selection */}
                    <div className="space-y-2">
                        <label className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-600 block">
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
                                            ? "bg-emerald-700 text-white border-emerald-700 font-black shadow-md shadow-emerald-700/20 scale-[1.01]"
                                            : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800 font-bold"
                                    }`}
                                >
                                    <span className="block text-xs sm:text-sm font-black truncate">{c.name}</span>
                                    <span className={`block text-[9px] sm:text-[10px] truncate ${selectedCommodity === c.id ? "text-emerald-100" : "text-slate-500"}`}>{c.kn}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* District Selection */}
                    <div className="space-y-2">
                        <label className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-600 block">
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
                                            ? "bg-emerald-700 text-white border-emerald-700 font-black shadow-md shadow-emerald-700/20 scale-[1.01]"
                                            : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800 font-bold"
                                    }`}
                                >
                                    <span className="block text-xs sm:text-sm font-black">{d.name} Market</span>
                                    <span className={`block text-[9px] sm:text-[10px] ${selectedDistrict === d.id ? "text-emerald-100" : "text-slate-500"}`}>{d.kn}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quantity Controls */}
                <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <label className="text-xs font-black uppercase tracking-wider text-slate-900 block">
                                3. Quantity ({unitLabel})
                            </label>
                            <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium">Enter quantity to calculate revenue</span>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                            <button
                                type="button"
                                onClick={() => setQuantity(Math.max(1, quantity - 5))}
                                className="p-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-extrabold shadow-xs active:scale-95 transition-transform"
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-24 text-center py-2 px-3 rounded-xl border border-emerald-600 bg-white text-lg font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-xs"
                            />
                            <button
                                type="button"
                                onClick={() => setQuantity(quantity + 5)}
                                className="p-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-extrabold shadow-xs active:scale-95 transition-transform"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Quick increment pills */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-2 border-t border-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 self-center mr-1">Quick Add:</span>
                        {[5, 10, 25, 50, 100].map((q) => (
                            <button
                                key={q}
                                type="button"
                                onClick={() => setQuantity(q)}
                                className="px-2.5 py-1 text-xs font-extrabold rounded-lg bg-white hover:bg-emerald-50 hover:text-emerald-700 border border-slate-300 transition-colors shadow-xs"
                            >
                                {q} {selectedCommodity.includes("COFFEE") ? "bags" : "kg"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Income Result Banner */}
                <div className="bg-emerald-50 border-2 border-emerald-200 p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center sm:text-left w-full sm:w-auto">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 block">
                            Estimated Total Revenue (ಒಟ್ಟು ಆದಾಯ)
                        </span>
                        <div className="text-3xl sm:text-5xl font-black text-emerald-700 tracking-tight">
                            ₹{totalEstimate.toLocaleString()}
                        </div>
                        <span className="text-xs text-slate-600 font-bold block">
                            {quantity} {selectedCommodity.includes("COFFEE") ? "bags" : "kg"} × ₹{unitPrice.toLocaleString()} per unit
                        </span>
                    </div>

                    <div className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-700 text-white px-5 py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-md">
                        <Coins className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span>Live Rate Applied</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
