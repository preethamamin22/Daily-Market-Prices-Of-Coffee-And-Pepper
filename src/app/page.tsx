export const dynamic = 'force-dynamic';
import { Header } from "@/components/Header";
import { PriceCard } from "@/components/PriceCard";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchLatestPrices } from "@/lib/scraper";

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

  // Helper to find previous price
  const getPrevPrice = (commodity: string, district: string) => {
    return prevPrices.find(
      (p: any) => p.commodity === commodity && p.district === district
    )?.price;
  };

  const kodaguPrices = prices.filter((p: any) => p.district === "KODAGU");
  const hassanPrices = prices.filter((p: any) => p.district === "HASSAN");

  return (
    <div className="min-h-screen bg-muted/10 pb-10">
      <Header />

      <main className="container px-4 py-8">
        <div className="text-center mb-10 space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Daily Market Prices</h1>
          <p className="text-muted-foreground text-lg">
            Latest Coffee and Pepper prices from Kodagu and Hassan markets.
          </p>
        </div>

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

        {kodaguPrices.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2 flex items-center gap-2">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">District</span>
              Kodagu
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kodaguPrices.map((p: any) => (
                <PriceCard
                  key={p.id}
                  commodity={p.commodity}
                  district={p.district}
                  price={p.price}
                  unit={p.unit}
                  date={p.date}
                  previousPrice={getPrevPrice(p.commodity, p.district)}
                />
              ))}
            </div>
          </div>
        )}

        {hassanPrices.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 border-b pb-2 flex items-center gap-2">
              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">District</span>
              Hassan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hassanPrices.map((p: any) => (
                <PriceCard
                  key={p.id}
                  commodity={p.commodity}
                  district={p.district}
                  price={p.price}
                  unit={p.unit}
                  date={p.date}
                  previousPrice={getPrevPrice(p.commodity, p.district)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t py-6 bg-background">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Coffee & Pepper Price Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
