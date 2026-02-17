import { COMMODITIES, DISTRICTS } from "./constants";

export interface PriceData {
    commodity: string;
    district: string;
    price: number;
    unit: string;
    date: string;
    source: string;
}

export async function getLatestPrices(): Promise<PriceData[]> {
    // TODO: Implement DB fetch
    // For now, return mock data
    return [
        {
            commodity: COMMODITIES.COFFEE_ARABICA,
            district: DISTRICTS.KODAGU,
            price: 28000,
            unit: "quintal",
            date: new Date().toISOString(),
            source: "Mock Source",
        },
        {
            commodity: COMMODITIES.PEPPER,
            district: DISTRICTS.KODAGU,
            price: 675,
            unit: "kg",
            date: new Date().toISOString(),
            source: "Mock Source",
        },
    ];
}

export async function fetchPricesFromSource() {
    // TODO: Implement scraping/fetching logic
    console.log("Fetching prices from external sources...");
}
