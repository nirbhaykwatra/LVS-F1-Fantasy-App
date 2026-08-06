import Link from "next/link";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import SignOutButton from "@/components/dashboard/SignOutButton";
import {PlayerName} from "@/components/dashboard/PlayerName";
import { Suspense } from "react";
import { LeaguesTable } from "@/components/dashboard/LeaguesTable";
import { ScoringBreakdownPanel } from "@/components/dashboard/ScoringBreakdownPanel";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import {DashboardLeagueDropdown} from "@/components/dashboard/DashboardLeagueDropdown";
import {LeagueStatistics} from "@/components/dashboard/LeagueStatistics";
import {PlayerNameNav} from "@/components/dashboard/PlayerNameNav";
import {LeagueLeaderboard} from "@/components/dashboard/LeagueLeaderboard";

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
                    <Suspense fallback={<div></div>}>
                            <PlayerNameNav />
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
                        <Suspense fallback={<div></div>}>
                            <PlayerName searchParams={ searchParams }/>
                        </Suspense>
                        <div className="sm:justify-self-end">
                            <Suspense fallback={<div></div>}>
                                <DashboardLeagueDropdown searchParams={ searchParams } />
                            </Suspense>
                        </div>
                    </div>

                </div>

                <Suspense fallback={<p></p>}>
                    <DashboardSummary searchParams={ searchParams }/>
                </Suspense>

                <Suspense fallback={<p></p>}>
                    <ScoringBreakdownPanel searchParams={ searchParams } />
                </Suspense>

                <Suspense fallback={<p></p>}>
                    <LeagueLeaderboard searchParams={ searchParams } />
                </Suspense>

                <Suspense fallback={<p></p>}>
                    <LeagueStatistics searchParams={ searchParams } />
                </Suspense>
                <Suspense fallback={<p></p>}>
                    <LeaguesTable />
                </Suspense>
            </main>
        </div>
    );
}