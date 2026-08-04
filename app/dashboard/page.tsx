import Link from "next/link";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import SignOutButton from "@/components/dashboard/SignOutButton";
import PlayerName from "@/components/dashboard/PlayerName";
import {Suspense} from "react";

// Placeholder user data
const user = {
    username: "Max Verstappen",
    email: "max@example.com",
    teamName: "Red Bull Racing",
    points: 320,
    rank: 1,
};

export default function DashboardPage() {
    return (
        <div className="relative isolate flex min-h-screen flex-col bg-background font-sans">
            <AnimatedBackground />

            <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10 border-b border-black/10 dark:border-white/10 bg-background/50 backdrop-blur-md">
                <Link
                    href="/"
                    className="flex items-center gap-2 font-mono text-sm font-bold tracking-widest text-foreground"
                >
                    <span className="h-2.5 w-2.5 rounded-full bg-brand" />
                    LVS F1 FANTASY
                </Link>
                <nav className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-foreground">
                    <Suspense fallback={<div>Loading...</div>}>
                            <PlayerName />
                        </Suspense>
                  </span>
                    <SignOutButton />
                </nav>
            </header>

            <main className="relative z-10 flex flex-1 flex-col gap-8 px-6 py-12 sm:px-10 max-w-5xl mx-auto w-full">
                {/* Welcome Section */}
                <div className="flex flex-col gap-2">
          <span className="w-fit rounded-full bg-brand/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
            Overview
          </span>
                    <h1 className="text-3xl font-black leading-tight text-foreground">
                        Welcome back, <Suspense fallback={<div>Loading...</div>}>
                            <PlayerName />
                        </Suspense>
                    </h1>
                    <p className="text-sm text-foreground/60">
                        Here is how your dream team is stacking up on the grid.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    {/* Card 1: Team Info */}
                    <div className="flex flex-col gap-2 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                        <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
                            Favorite Team
                        </h2>
                        <p className="text-2xl font-bold text-foreground">{user.teamName}</p>
                    </div>

                    {/* Card 2: Points */}
                    <div className="flex flex-col gap-2 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                        <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
                            Total Points
                        </h2>
                        <p className="text-2xl font-bold text-brand">{user.points} PTS</p>
                    </div>

                    {/* Card 3: Global Rank */}
                    <div className="flex flex-col gap-2 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                        <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
                            Global Rank
                        </h2>
                        <p className="text-2xl font-bold text-foreground">#{user.rank}</p>
                    </div>
                </div>

                {/* Extended Activity Area */}
                <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 mt-4">
                    <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
                    <div className="h-px w-full bg-black/10 dark:bg-white/10" />
                    <p className="text-sm text-foreground/60 text-center py-8">
                        No race data recorded for this week yet.
                    </p>
                </div>
            </main>

            <footer className="relative z-10 mt-auto flex items-center justify-center px-6 py-6 text-xs text-foreground/50">
                © {new Date().getFullYear()} LVS F1 Fantasy. Not affiliated with Formula 1.
            </footer>
        </div>
    );
}