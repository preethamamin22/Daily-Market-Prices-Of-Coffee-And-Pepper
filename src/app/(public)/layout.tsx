import { PublicHeader } from "@/components/public-header";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <PublicHeader />
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} Price Tracker. Data sourced from public markets.
            </footer>
        </div>
    );
}
