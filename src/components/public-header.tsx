import Link from "next/link";
import { Coffee } from "lucide-react";

export function PublicHeader() {
    return (
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <Coffee className="h-6 w-6 text-primary" />
                    <span>Kodagu & Hassan Prices</span>
                </Link>
                <nav className="flex items-center gap-4 text-sm font-medium">
                    <Link href="/" className="transition-colors hover:text-foreground/80">
                        Home
                    </Link>
                    <Link href="/history" className="transition-colors hover:text-foreground/80">
                        History
                    </Link>
                    <Link href="/login" className="transition-colors hover:text-foreground/80">
                        Login
                    </Link>
                </nav>
            </div>
        </header>
    );
}
