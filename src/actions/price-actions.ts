"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { PriceData } from "@/lib/price-service";

export async function addPrice(data: PriceData) {
    try {
        // In a real app, you'd use the Prisma client here
        // await prisma.dailyPrice.create({ data });

        console.log("Server Action: Adding price", data);

        // Mock delay
        await new Promise(resolve => setTimeout(resolve, 500));

        revalidatePath("/");
        revalidatePath("/history");
        revalidatePath("/dashboard");

        return { success: true };
    } catch (error) {
        console.error("Failed to add price:", error);
        return { success: false, error: "Failed to add price" };
    }
}

export async function syncPrices() {
    try {
        console.log("Server Action: Syncing prices from external sources");
        // Trigger scraper logic here
        await new Promise(resolve => setTimeout(resolve, 2000));
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to sync" };
    }
}
