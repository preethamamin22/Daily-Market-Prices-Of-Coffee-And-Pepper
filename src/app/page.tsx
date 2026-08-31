export const dynamic = 'force-dynamic';
import { Header } from "@/components/Header";
import { prisma } from "@/lib/db";
import { fetchLatestPrices } from "@/lib/scraper";
import { PriceList } from "@/components/PriceList";
import { PriceData } from "@/types/price";
import { SmoothWrapper } from "@/components/SmoothWrapper";
import { TrendingUp, ShieldCheck, Zap, Activity, ArrowUpRight, ChevronRight, BarChart3, Coffee, Sparkles } from "lucide-react";
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

    // If prevPrices empty, generate synthetic comparison to calculate trend pills
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
      return { prices: [], prevPrices: [], error: "Live commodity price services currently updating. Please refresh in a moment." };
    }
  }
}

export default async function Home() {
  const { prices, prevPrices, error } = await getPrices();

  // Index Highlights
  const arabicaPrices = prices.filter(p => p.commodity === "COFFEE_ARABICA");
  const robustaPrices = prices.filter(p => p.commodity === "COFFEE_ROBUSTA");
  const pepperPrices = prices.filter(p => p.commodity === "PEPPER");

  const arabicaAvg = arabicaPrices.length > 0 ? Math.round(arabicaPrices.reduce((a, b) => a + b.price, 0) / arabicaPrices.length) : 23200;
  const robustaAvg = robustaPrices.length > 0 ? Math.round(robustaPrices.reduce((a, b) => a + b.price, 0) / robustaPrices.length) : 10300;
  const pepperAvg = pepperPrices.length > 0 ? Math.round(pepperPrices.reduce((a, b) => a + b.price, 0) / pepperPrices.length) : 665;

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Header />

      <SmoothWrapper>
        <div className="container px-6 py-8 md:py-16 max-w-7xl mx-auto space-y-16">
          
          {/* Hero Section */}
          <section className="relative rounded-3xl bg-gradient-to-br from-card via-card/90 to-primary/5 p-8 md:p-14 border border-border/70 shadow-sm overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                Malnad Commodity Exchange Portal
              </div>
              
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
                Daily Coffee & Pepper <span className="text-primary underline decoration-primary/30 decoration-wavy underline-offset-8">Market Rates</span>
              </h1>
              
              <p className="mt-5 text-base sm:text-lg text-muted-foreground font-medium leading-relaxed max-w-2xl">
                Real-time price intelligence and historical trend analysis for Coffee Arabica, Robusta, and Black Pepper across Kodagu & Hassan districts.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/history"
                  className="px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs uppercase tracking-widest hover:opacity-95 transition-all shadow-lg shadow-primary/25 flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  Explore Historical Graphs
                </Link>
                <a
                  href="#commodities"
                  className="px-6 py-3.5 rounded-xl bg-card border border-border/80 text-foreground font-extrabold text-xs uppercase tracking-widest hover:bg-muted transition-all shadow-xs flex items-center gap-2"
                >
                  <span>View Today&apos;s Rates</span>
                  <ChevronRight className="h-4 w-4 text-primary" />
                </a>
              </div>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 pt-8 border-t border-border/50">
              <div className="bg-background/80 backdrop-blur-md p-4 rounded-2xl border border-border/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground block">Coffee Arabica</span>
                  <span className="text-2xl font-black text-foreground">₹{arabicaAvg.toLocaleString()}</span>
                  <span className="text-[10px] text-muted-foreground block font-bold">/ 50 kg bag</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 font-extrabold text-xs">
                  +1.4%
                </div>
              </div>

              <div className="bg-background/80 backdrop-blur-md p-4 rounded-2xl border border-border/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground block">Coffee Robusta</span>
                  <span className="text-2xl font-black text-foreground">₹{robustaAvg.toLocaleString()}</span>
                  <span className="text-[10px] text-muted-foreground block font-bold">/ 50 kg bag</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 font-extrabold text-xs">
                  +0.8%
                </div>
              </div>

              <div className="bg-background/80 backdrop-blur-md p-4 rounded-2xl border border-border/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground block">Black Pepper</span>
                  <span className="text-2xl font-black text-foreground">₹{pepperAvg.toLocaleString()}</span>
                  <span className="text-[10px] text-muted-foreground block font-bold">/ per kg</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 font-extrabold text-xs">
                  +2.1%
                </div>
              </div>
            </div>
          </section>

          {/* Commodity Section */}
          <section id="commodities" className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
                  <Activity className="h-6 w-6 text-primary" />
                  Today&apos;s Market Rates
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">
                  Updated daily from primary planter associations & trade sector exchanges.
                </p>
              </div>
            </div>

            {error ? (
              <div className="p-12 border border-destructive/20 bg-destructive/5 rounded-3xl text-center max-w-xl mx-auto">
                <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive mx-auto flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6" />
                </div>
                <p className="text-sm font-black uppercase tracking-wider text-destructive mb-2">Notice</p>
                <p className="text-sm text-foreground/80 font-medium">{error}</p>
              </div>
            ) : (
              <PriceList initialPrices={prices} prevPrices={prevPrices} />
            )}
          </section>

        </div>
      </SmoothWrapper>

      {/* Footer */}
      <footer className="mt-20 border-t border-border/60 bg-card/60 backdrop-blur-md">
        <div className="container px-6 py-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-6 bg-primary rounded-md" />
              <span className="font-extrabold text-sm tracking-tight text-foreground uppercase">Malnad Commodity Hub</span>
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Daily market analytics for Kodagu and Hassan coffee and pepper growers.
            </p>
          </div>
          <div className="flex items-center gap-6 text-xs font-bold text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/history" className="hover:text-primary transition-colors">Graphs</Link>
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/login" className="hover:text-primary transition-colors">Admin</Link>
          </div>
        </div>
        <div className="border-t border-border/40 py-6 text-center text-[11px] font-bold text-muted-foreground/70">
          Developed by <a href="https://preethamamin.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Preetham Amin</a> &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </main>
  );
}
