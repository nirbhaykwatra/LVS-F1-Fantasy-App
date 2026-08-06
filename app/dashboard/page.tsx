import Link from "next/link";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import Footer from "@/components/Footer";
import SignOutButton from "@/components/dashboard/SignOutButton";
import PlayerName from "@/components/dashboard/PlayerName";
import { Suspense } from "react";
import { LeaguesTable } from "@/components/dashboard/LeaguesTable";
import { ScoringBreakdownPanel } from "@/components/dashboard/ScoringBreakdownPanel";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import {DashboardLeagueDropdown} from "@/components/dashboard/DashboardLeagueDropdown";

export default function DashboardPage( { searchParams }: { searchParams: Promise<{ round?: string, leagueId?: string }> } ) {
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <h1 className="text-3xl font-black leading-tight text-foreground">
                                Welcome back, <Suspense fallback={<div>Loading...</div>}>
                                <PlayerName />
                            </Suspense>
                            </h1>
                            <p className="text-sm text-foreground/60">
                                Here is how your dream team is stacking up on the grid.
                            </p>
                        </div>
                        <div className="sm:justify-self-end">
                            <Suspense fallback={<div>Loading...</div>}>
                                <DashboardLeagueDropdown searchParams={ searchParams } />
                            </Suspense>
                        </div>
                    </div>

                </div>

                <Suspense fallback={<p>Loading...</p>}>
                    <DashboardSummary />
                </Suspense>

                <Suspense fallback={<p>Loading...</p>}>
                    <ScoringBreakdownPanel searchParams={ searchParams } />
                </Suspense>

                {/* Extended Activity Area */}
                <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 mt-4">
                    <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
                    <div className="h-px w-full bg-black/10 dark:bg-white/10" />
                    <p className="text-sm text-foreground/60 text-center py-8">
                        No race data recorded for this week yet.
                    </p>
                </div>
                <Suspense fallback={<p>Loading...</p>}>
                    <LeaguesTable />
                </Suspense>
            </main>

            <Footer />
        </div>
    );
}