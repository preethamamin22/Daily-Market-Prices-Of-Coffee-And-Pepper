import { Header } from "@/components/Header";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserPlus, Clock } from "lucide-react";
import { format } from "date-fns";

async function getAdminData() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" }
    });

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const today = new Date(now.setHours(0, 0, 0, 0));

    const stats = {
        totalUsers: users.length,
        newUsersThisWeek: users.filter((u: any) => u.createdAt > weekAgo).length,
        activeToday: users.filter((u: any) => u.lastLogin && u.lastLogin > today).length,
        totalLogins: users.reduce((acc: number, u: any) => acc + (u.loginCount || 0), 0)
    };

    return { users, stats };
}

export default async function AdminUsersPage() {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
        redirect("/login");
    }

    const { users, stats } = await getAdminData();

    return (
        <div className="min-h-screen bg-muted/10 pb-10">
            {/* @ts-ignore - async component */}
            <Header />

            <main className="container px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">User Analytics</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalUsers}</div>
                            <p className="text-xs text-muted-foreground">All registered users</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">New This Week</CardTitle>
                            <UserPlus className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+{stats.newUsersThisWeek}</div>
                            <p className="text-xs text-muted-foreground">In the last 7 days</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Active Today</CardTitle>
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.activeToday}</div>
                            <p className="text-xs text-muted-foreground">Users logged in today</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalLogins}</div>
                            <p className="text-xs text-muted-foreground">Across all sessions</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Registered Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Last Login</TableHead>
                                    <TableHead>Logins</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead>Role</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user: any) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{user.name || "N/A"}</span>
                                                <span className="text-xs text-muted-foreground">{user.email || user.phone || "No contact"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="capitalize text-xs bg-muted px-2 py-1 rounded">
                                                {user.googleId ? "Google" : user.password ? "Email" : "N/A"}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {user.lastLogin ? format(new Date(user.lastLogin), "dd MMM, hh:mm a") : "Never"}
                                        </TableCell>
                                        <TableCell>{user.loginCount}</TableCell>
                                        <TableCell>
                                            {format(new Date(user.createdAt), "dd MMM yyyy")}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`text-xs px-2 py-1 rounded ${user.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                                {user.role}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
