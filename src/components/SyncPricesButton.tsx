"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function SyncPricesButton() {
    const [loading, setLoading] = useState(false);

    const handleSync = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/prices", { method: "POST" });
            if (res.ok) {
                window.location.reload();
            } else {
                alert("Failed to sync live prices");
            }
        } catch (error) {
            console.error("Sync error:", error);
            alert("An error occurred during sync");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="secondary"
            onClick={handleSync}
            disabled={loading}
            className="flex items-center gap-2"
        >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Syncing..." : "Sync Live Prices"}
        </Button>
    );
}
