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
    return {
      prices: [],
      prevPrices: [],
      error: error instanceof Error ? error.message : "Unknown database error"
    };
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
          <header className="mb-24 max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-primary leading-[0.9]">
              Today&apos;s <br />Market <span className="text-foreground/20">Pulse.</span>
            </h1>
            <p className="text-foreground/40 text-[11px] uppercase tracking-[0.25em] font-black leading-relaxed max-w-md">
              Real-time monitoring and analytics for coffee and pepper commodities in the Malnad region.
            </p>
          </header>

          {error ? (
            <div className="p-12 border border-destructive/20 bg-destructive/5 rounded-2xl text-center">
              <p className="text-destructive font-black uppercase tracking-[0.2em] text-[10px] mb-2">System Interruption</p>
              <p className="text-sm text-foreground/60">{error}</p>
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
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/20">
              &copy; {new Date().getFullYear()} Malnad Commodity Exchange
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
