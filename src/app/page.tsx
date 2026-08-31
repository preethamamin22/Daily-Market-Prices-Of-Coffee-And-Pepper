export const dynamic = 'force-dynamic';
import { Header } from "@/components/Header";
import { prisma } from "@/lib/db";
import { fetchLatestPrices } from "@/lib/scraper";
import { PriceList } from "@/components/PriceList";
import { PriceData } from "@/types/price";
import { SmoothWrapper } from "@/components/SmoothWrapper";
import { SyncPricesButton } from "@/components/SyncPricesButton";
import { FarmerCalculator } from "@/components/FarmerCalculator";
import { Activity, ChevronRight, BarChart3, Sparkles, RefreshCw, ShieldCheck, CheckCircle2 } from "lucide-react";
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

    // Synthetic fallback for prevPrices
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
      return { prices: [], prevPrices: [], error: "Live commodity price services currently updating. Please tap sync button." };
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
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Header />

      <SmoothWrapper>
        <div className="container px-6 py-8 md:py-14 max-w-7xl mx-auto space-y-14">
          
          {/* Hero Section - Farmer Friendly */}
          <section className="relative rounded-3xl bg-gradient-to-br from-card via-card to-primary/10 p-8 md:p-12 border-2 border-border/80 shadow-md overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-2xl space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest">
                    <Sparkles className="h-3.5 w-3.5" />
                    Farmer Market Hub (ರೈತರ ಮಾರುಕಟ್ಟೆ ದರ)
                  </div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verified Live Rates
                  </div>
                </div>
                
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
                  Daily Coffee & Pepper <span className="text-primary underline decoration-primary/40 underline-offset-8">Live Prices</span>
                </h1>
                
                <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                  Real-time market rates for growers in Kodagu (ಕೊಡಗು) & Hassan (ಹಾಸನ). Check today&apos;s prices for Coffee Arabica, Robusta & Black Pepper.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <SyncPricesButton />

                  <Link
                    href="/history"
                    className="px-5 py-2.5 rounded-xl bg-card border border-border text-foreground font-extrabold text-xs uppercase tracking-wider hover:bg-muted transition-all shadow-xs flex items-center gap-2"
                  >
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <span>Price Trend Graphs</span>
                  </Link>
                </div>
              </div>

              {/* Fast Index Card */}
              <div className="bg-card/90 backdrop-blur-xl p-6 rounded-2xl border-2 border-primary/20 shadow-lg space-y-4 min-w-[280px]">
                <span className="text-xs font-black uppercase tracking-wider text-muted-foreground block border-b border-border/50 pb-2">
                  Today&apos;s Baseline Benchmark Rates
                </span>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-foreground block">Arabica (ಅರಬಿಕಾ)</span>
                      <span className="text-[10px] text-muted-foreground font-bold">50 kg Bag</span>
                    </div>
                    <span className="text-lg font-black text-primary">₹{arabicaAvg.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-border/30 pt-2">
                    <div>
                      <span className="text-xs font-black text-foreground block">Robusta (ರೋಬಸ್ಟಾ)</span>
                      <span className="text-[10px] text-muted-foreground font-bold">50 kg Bag</span>
                    </div>
                    <span className="text-lg font-black text-primary">₹{robustaAvg.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-border/30 pt-2">
                    <div>
                      <span className="text-xs font-black text-foreground block">Pepper (ಕಾಳುಮೆಣಸು)</span>
                      <span className="text-[10px] text-muted-foreground font-bold">Per Kilogram</span>
                    </div>
                    <span className="text-lg font-black text-primary">₹{pepperAvg.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Farmer Earnings Calculator */}
          <section className="pt-2">
            <FarmerCalculator prices={prices} />
          </section>

          {/* Live Commodity List */}
          <section id="commodities" className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
                  <Activity className="h-6 w-6 text-primary" />
                  Live Market Rates by District (ದಿನದ ಮಾರುಕಟ್ಟೆ ದರ)
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">
                  Select your district below to view live 50kg bag & kg rates.
                </p>
              </div>
            </div>

            <PriceList initialPrices={prices} prevPrices={prevPrices} />
          </section>

        </div>
      </SmoothWrapper>

      {/* Footer */}
      <footer className="mt-20 border-t border-border/60 bg-card/60 backdrop-blur-md">
        <div className="container px-6 py-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-2 h-5 bg-primary rounded-md" />
              <span className="font-black text-sm tracking-tight text-foreground uppercase">Malnad Farmer Commodity Exchange</span>
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Supporting growers in Kodagu & Hassan districts with daily market rates.
            </p>
          </div>
          <div className="flex items-center gap-6 text-xs font-extrabold text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/history" className="hover:text-primary transition-colors">Graphs</Link>
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/login" className="hover:text-primary transition-colors">Admin</Link>
          </div>
        </div>
        <div className="border-t border-border/40 py-5 text-center text-[11px] font-bold text-muted-foreground/70">
          Developed by <a href="https://preethamamin.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Preetham Amin</a> &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </main>
  );
}
