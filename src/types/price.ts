export interface PriceData {
    id: string;
    commodity: string;
    district: string;
    price: number;
    unit: string;
    date: Date;
    source?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PriceListProps {
    initialPrices: PriceData[];
    prevPrices: PriceData[];
}

export interface HistoryData {
    date: string;
    price: number;
    timestamp: number;
    fullDate?: string;
}
