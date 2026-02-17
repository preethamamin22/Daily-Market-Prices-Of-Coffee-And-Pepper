import Link from "next/link";
import { LayoutDashboard, LogOut } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex">
            <aside className="w-64 border-r bg-muted/40 hidden md:block">
                <div className="flex h-16 items-center border-b px-6 font-semibold">
                    Admin Panel
                </div>
                <nav className="flex flex-col gap-2 p-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                    </Link>
                    {/* Add more admin links here */}
                </nav>
            </aside>
            <div className="flex-1 flex flex-col">
                <header className="h-16 border-b flex items-center justify-between px-6">
                    <h1 className="font-semibold text-lg">Dashboard</h1>
                    <button className="text-sm font-medium flex items-center gap-2 text-destructive">
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </header>
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}
