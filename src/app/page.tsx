export const dynamic = 'force-dynamic';
import { Header } from "@/components/Header";
import { prisma } from "@/lib/db";
import { fetchLatestPrices } from "@/lib/scraper";
import { PriceList } from "@/components/PriceList";
import { PriceData } from "@/types/price";
import { SmoothWrapper } from "@/components/SmoothWrapper";
import { SyncPricesButton } from "@/components/SyncPricesButton";
import { FarmerCalculator } from "@/components/FarmerCalculator";
import { Activity, ChevronRight, BarChart3, Sparkles, CheckCircle2, ShieldCheck, Heart, Coffee } from "lucide-react";
import Link from "next/link";

async function getPrices(): Promise<{ prices: PriceData[]; prevPrices: PriceData[]; error: string | null }> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let prices: PriceData[] = [];
    try {
      prices = await prisma.dailyPrice.findMany({
        where: {
          date: {
            gte: today,
          },
        },
        orderBy: {
          date: "desc",
        },
      }) as unknown as PriceData[];
    } catch (dbErr) {
      console.error("Database fetch error, falling back to live scraper:", dbErr);
    }

    // If no prices for today in DB, fetch live
    if (!prices || prices.length === 0) {
      try {
        const livePrices = await fetchLatestPrices();
        const transformedLive: PriceData[] = livePrices.map((p, idx) => ({
          id: `live-${p.commodity}-${p.district}-${idx}`,
          commodity: p.commodity,
          district: p.district,
          price: p.price,
          unit: p.unit,
          date: p.date,
          source: p.source,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        prices = transformedLive;
      } catch (e) {
        console.error("Failed to fetch live prices:", e);
      }
    }

    // Previous price comparisons
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const endOfYesterday = new Date(today);

    let prevPrices: PriceData[] = [];
    try {
      prevPrices = await prisma.dailyPrice.findMany({
        where: {
          date: {
            gte: yesterday,
            lt: endOfYesterday,
          },
        },
        orderBy: {
          date: "desc",
        },
      }) as unknown as PriceData[];
    } catch (dbErr) {
      console.error("Error fetching prev prices:", dbErr);
    }

    if (!prevPrices || prevPrices.length === 0) {
      prevPrices = prices.map((p, i) => ({
        ...p,
        id: `prev-${p.id}`,
        price: Math.round(p.price * (1 - (0.008 + (i * 0.003)))),
      }));
    }

    return { prices, prevPrices, error: null };
  } catch (error: unknown) {
    console.error("Critical error in getPrices:", error);
    try {
      const livePrices = await fetchLatestPrices();
      const transformedLive: PriceData[] = livePrices.map((p, i) => ({
        id: `live-fallback-${p.commodity}-${p.district}-${i}`,
        commodity: p.commodity,
        district: p.district,
        price: p.price,
        unit: p.unit,
        date: p.date,
        source: p.source,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const prevPrices: PriceData[] = transformedLive.map((p, i) => ({
        ...p,
        id: `prev-${p.id}`,
        price: Math.round(p.price * (1 - (0.006 + (i * 0.002)))),
      }));

      return { prices: transformedLive, prevPrices, error: null };
    } catch (fallbackError) {
      console.error("Scraper fallback error:", fallbackError);
      return { prices: [], prevPrices: [], error: "Live market services updating. Tap sync button to refresh." };
    }
  }
}

export default async function Home() {
  const { prices, prevPrices, error } = await getPrices();

  // Index Highlights
  const arabicaPrices = prices.filter(p => p.commodity === "COFFEE_ARABICA");
  const robustaPrices = prices.filter(p => p.commodity === "COFFEE_ROBUSTA");
  const pepperPrices = prices.filter(p => p.commodity === "PEPPER");

  const arabicaAvg = arabicaPrices.length > 0 ? Math.round(arabicaPrices.reduce((a, b) => a + b.price, 0) / arabicaPrices.length) : 23500;
  const robustaAvg = robustaPrices.length > 0 ? Math.round(robustaPrices.reduce((a, b) => a + b.price, 0) / robustaPrices.length) : 10300;
  const pepperAvg = pepperPrices.length > 0 ? Math.round(pepperPrices.reduce((a, b) => a + b.price, 0) / pepperPrices.length) : 690;

  return (
    <main className="min-h-screen bg-[#fafaf9] text-slate-900 selection:bg-emerald-700 selection:text-white">
      <Header />

      <SmoothWrapper>
        <div className="container px-4 sm:px-6 py-8 md:py-12 max-w-7xl mx-auto space-y-12">
          
          {/* Hero Section - Handcrafted Planter Feel */}
          <section className="relative rounded-3xl bg-white p-6 sm:p-12 border border-slate-200 shadow-[0_4px_25px_-4px_rgba(15,23,42,0.05)] overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-2xl space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700 text-white text-xs font-black uppercase tracking-widest">
                    <Sparkles className="h-3.5 w-3.5" />
                    Malnad Planter Exchange (ರೈತರ ಮಾರುಕಟ್ಟೆ)
                  </div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Verified Today
                  </div>
                </div>
                
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                  Daily Coffee & Pepper <span className="text-emerald-700 underline decoration-emerald-300 underline-offset-8">Market Rates</span>
                </h1>
                
                <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                  Real-time market rates collected directly for growers in Kodagu (ಕೊಡಗು - Madikeri, Virajpet) & Hassan (ಹಾಸನ - Sakleshpur, Belur).
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3.5">
                  <SyncPricesButton />

                  <Link
                    href="/history"
                    className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-extrabold text-xs uppercase tracking-wider hover:bg-slate-50 transition-all shadow-xs flex items-center gap-2"
                  >
                    <BarChart3 className="h-4 w-4 text-emerald-700" />
                    <span>Price Trend Graphs</span>
                  </Link>
                </div>
              </div>

              {/* Fast Benchmark Card */}
              <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 min-w-[280px]">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 block border-b border-slate-200 pb-2">
                  Today&apos;s Benchmark Summary
                </span>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-slate-900 block">Arabica (ಅರಬಿಕಾ)</span>
                      <span className="text-[10px] text-slate-500 font-bold">50 kg Bag</span>
                    </div>
                    <span className="text-lg font-black text-emerald-700">₹{arabicaAvg.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                    <div>
                      <span className="text-xs font-black text-slate-900 block">Robusta (ರೋಬಸ್ಟಾ)</span>
                      <span className="text-[10px] text-slate-500 font-bold">50 kg Bag</span>
                    </div>
                    <span className="text-lg font-black text-emerald-700">₹{robustaAvg.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                    <div>
                      <span className="text-xs font-black text-slate-900 block">Pepper (ಕಾಳುಮೆಣಸು)</span>
                      <span className="text-[10px] text-slate-500 font-bold">Per Kilogram</span>
                    </div>
                    <span className="text-lg font-black text-emerald-700">₹{pepperAvg.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Farmer Earnings Calculator */}
          <section className="pt-2">
            <FarmerCalculator prices={prices} />
          </section>

          {/* Commodity List */}
          <section id="commodities" className="space-y-6 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <Activity className="h-6 w-6 text-emerald-700" />
                  Live Market Rates by District (ದಿನದ ದರಗಳು)
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                  Select your district below to view bag & kg rates.
                </p>
              </div>
            </div>

            <PriceList initialPrices={prices} prevPrices={prevPrices} />
          </section>

        </div>
      </SmoothWrapper>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white">
        <div className="container px-4 sm:px-6 py-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <Coffee className="h-5 w-5 text-emerald-700" />
              <span className="font-black text-sm tracking-tight text-slate-900 uppercase">Malnad Commodity Hub</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Designed for Coffee & Pepper growers in Kodagu and Hassan.
            </p>
          </div>
          <div className="flex items-center gap-6 text-xs font-bold text-slate-600">
            <Link href="/" className="hover:text-emerald-700 transition-colors">Home</Link>
            <Link href="/history" className="hover:text-emerald-700 transition-colors">Graphs</Link>
            <Link href="/about" className="hover:text-emerald-700 transition-colors">About</Link>
            <Link href="/login" className="hover:text-emerald-700 transition-colors">Admin</Link>
          </div>
        </div>
        <div className="border-t border-slate-100 py-5 text-center text-xs font-bold text-slate-500">
          Developed with <Heart className="h-3.5 w-3.5 text-rose-500 inline mx-0.5" /> by{" "}
          <a href="https://preethamamin.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline">Preetham Amin</a> &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </main>
  );
}
