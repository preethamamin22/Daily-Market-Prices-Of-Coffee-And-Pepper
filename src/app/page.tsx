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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pb-20">
      <Header />

      <main className="container px-4 py-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-amber-600 outline-none">
            Daily Market Prices
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Real-time Coffee and Pepper rates from the heart of Karnataka.
          </p>
        </motion.div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <p className="font-bold flex items-center gap-2 mb-1">
              ⚠️ Database Connection Warning
            </p>
            <p>The application is having trouble connecting to the database. This is usually due to missing Environment Variables on Vercel.</p>
            <p className="mt-2 p-2 bg-red-100 rounded font-mono text-xs overflow-auto">
              Error Details: {error}
            </p>
          </div>
        )}

        {prices.length === 0 && !error && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
            <p className="text-xl text-muted-foreground">No prices updated for today yet.</p>
            <p className="text-sm text-muted-foreground mt-2">Check back later or contact admin.</p>
          </div>
        )}

        <PriceList initialPrices={prices} prevPrices={prevPrices} />
      </main>

      <footer className="border-t py-6 bg-background">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Coffee & Pepper Price Tracker. All rights reserved.</p>
          <p className="mt-2">
            Created by <a href="https://preethamamin.framer.website/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnq-FqHd1jwdFPLLgbiSYlb5GsSm_Nt8tmSURFDa-tZouVfp3OU5oTTpKa6_k_aem_cKoKzXCgHGODmRRcwMolOw" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-primary transition-colors">Preetham Amin</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
