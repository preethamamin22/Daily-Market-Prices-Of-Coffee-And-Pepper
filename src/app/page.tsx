export const dynamic = 'force-dynamic';
import { Header } from "@/components/Header";
import { prisma } from "@/lib/db";
import { fetchLatestPrices } from "@/lib/scraper";
import { PriceList } from "@/components/PriceList";
import * as motion from "framer-motion/client";

async function getPrices() {
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
    });

    // If no prices for today, try to fetch live
    if (prices.length === 0) {
      try {
        const livePrices = await fetchLatestPrices();
        const transformedLive = livePrices.map(p => ({
          id: `live-${p.commodity}-${p.district}`,
          ...p,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        // @ts-ignore
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
    });

    return { prices, prevPrices, error: null };
  } catch (error: any) {
    console.error("Critical error in getPrices:", error);
    return { prices: [], prevPrices: [], error: error.message || "Unknown database error" };
  }
}

export default async function Home() {
  const { prices, prevPrices, error } = await getPrices();

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="container px-6 py-12 md:py-24 max-w-7xl mx-auto">
        <header className="mb-20 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            Today's Market.
          </h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">
            Live price tracking for Kodagu & Hassan districts.
          </p>
        </header>

        {error ? (
          <div className="p-12 border border-destructive/20 bg-destructive/5 rounded-xl text-center">
            <p className="text-destructive font-bold uppercase tracking-widest text-[10px] mb-2">Error connecting to database</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : (
          <PriceList initialPrices={prices} prevPrices={prevPrices} />
        )}
      </div>

      <footer className="container px-6 py-20 border-t border-muted mt-20 max-w-7xl mx-auto text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
            &copy; {new Date().getFullYear()} Market Price Tracker
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-primary transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
