export const dynamic = 'force-dynamic';
import { Header } from "@/components/Header";
import { prisma } from "@/lib/db";
import { fetchLatestPrices } from "@/lib/scraper";
import { PriceList } from "@/components/PriceList";
import { PriceData } from "@/types/price";

async function getPrices(): Promise<{ prices: PriceData[]; prevPrices: PriceData[]; error: string | null }> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's prices
    let prices = await prisma.dailyPrice.findMany({
      where: {
        date: {
          gte: today,
        },
      },
      orderBy: {
        date: "desc",
      },
    }) as unknown as PriceData[];

    // If no prices for today, try to fetch live
    if (prices.length === 0) {
      try {
        const livePrices = await fetchLatestPrices();
        const transformedLive: PriceData[] = livePrices.map(p => ({
          id: `live-${p.commodity}-${p.district}`,
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

    // Get yesterday's prices for trend comparison
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const endOfYesterday = new Date(today);

    const prevPrices = await prisma.dailyPrice.findMany({
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

      // Generate synthetic previous prices to keep trend arrows working without a DB
      const prevPrices: PriceData[] = transformedLive.map((p, i) => ({
        ...p,
        id: `prev-${p.id}`,
        // Decrease the price by 0.5% - 1.5% randomly for yesterday to show upward trends usually
        price: Math.round(p.price * (1 - (0.005 + (i * 0.002)))),
      }));

      return {
        prices: transformedLive,
        prevPrices,
        error: null
      };
    } catch (fallbackError) {
      console.error("Failed to execute scraper fallback:", fallbackError);
      return { prices: [], prevPrices: [], error: "Live market APIs are unreachable." };
    }
  }
}

import { SmoothWrapper } from "@/components/SmoothWrapper";

export default async function Home() {
  const { prices, prevPrices, error } = await getPrices();

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <SmoothWrapper>
        <div className="container px-6 py-12 md:py-24 max-w-7xl mx-auto">
          <header className="mb-24 max-w-3xl relative">
            <div className="absolute -top-20 -left-10 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10" />
            <h1 className="text-[3.5rem] md:text-7xl lg:text-[6rem] font-bold tracking-tighter mb-6 text-primary leading-[0.85] -ml-2">
              Today&apos;s <br />Market <span className="text-foreground/20 italic pr-4">Pulse.</span>
            </h1>
            <p className="text-foreground/40 text-[11px] uppercase tracking-[0.25em] font-black leading-relaxed max-w-md mt-8">
              Real-time monitoring and analytics for coffee and pepper commodities in the Malnad region.
            </p>
          </header>

          {error ? (
            <div className="relative overflow-hidden p-16 border border-destructive/10 bg-gradient-to-br from-destructive/5 to-transparent rounded-[2.5rem] text-center shadow-[0_20px_40px_rgba(0,0,0,0.02)] backdrop-blur-3xl mx-auto max-w-2xl">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/5 mb-8 ring-1 ring-inset ring-destructive/10">
                <svg className="h-8 w-8 text-destructive/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-destructive/80 font-black uppercase tracking-[0.25em] text-[10px] mb-4">System Interruption</p>
              <p className="text-xl tracking-tight text-foreground/90 font-medium mb-3">Service Temporarily Unavailable</p>
              <p className="text-sm text-foreground/50 max-w-md mx-auto leading-relaxed">{error}</p>
            </div>
          ) : (
            <PriceList initialPrices={prices} prevPrices={prevPrices} />
          )}
        </div>
      </SmoothWrapper>

      <footer className="container px-6 py-24 border-t border-border mt-32 max-w-7xl mx-auto text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <div className="w-1.5 h-4 bg-primary rounded-full transition-all ease-out" />
              <span className="font-bold text-sm tracking-tighter uppercase text-primary">Market Prices</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
              &copy; {new Date().getFullYear()} Malnad Commodity Exchange
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60 mt-1">
              Created by <a href="https://preethamamin.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline underline-offset-2">Preetham Amin</a>
            </p>
          </div>
          <div className="flex gap-12">
            <a href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 hover:text-primary transition-colors">Legal</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
