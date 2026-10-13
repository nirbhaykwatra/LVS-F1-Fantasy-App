import { AnimatedBackground } from "@/components/common/AnimatedBackground";
import { SignOutButton } from "@/components/common/UI";
import { PlayerNameNav } from "@/components/common/UIServer";
import { PlayerName } from "@/components/dashboard/LeagueDashboardServerComponents";
import { Suspense } from "react";
import {
    LeagueDropdown,
    PlayerStatistics,
    LeagueLeaderboard,
    LeagueStatistics,
    ScoringBreakdownPanel,
    Summary
} from "@/components/dashboard/LeagueDashboardServerComponents";
import { getCurrentUser } from "@/lib/dal/user";
import { HeaderLogoButton } from "@/components/common/Header";
import { getLeagueBySlug } from "@/lib/dal/leagues";

export default async function LeagueDashboardPage({ searchParams, params }: { searchParams: Promise<{ round?: string }>, params: Promise<{ leagueSlug: string }> } ) {
    const user = await getCurrentUser();
    if (!user) return null;

    const { leagueSlug } = await params;
    const league = await getLeagueBySlug(leagueSlug);
    const id = String(league?.id);

    return (
        <div className="relative isolate flex min-h-screen flex-col bg-background font-sans">
            <AnimatedBackground />

            <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10 border-b border-black/10 dark:border-white/10 bg-background/50 backdrop-blur-md">
                <HeaderLogoButton />
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
                            <PlayerName leagueId={ id }/>
                        </Suspense>
                        <div className="sm:justify-self-end">
                            <Suspense fallback={<div></div>}>
                                <LeagueDropdown leagueId={ id } />
                            </Suspense>
                        </div>
                    </div>

                </div>

                <Suspense fallback={<p></p>}>
                    <Summary leagueId={ id }/>
                    <ScoringBreakdownPanel round={ (await searchParams)?.round} />
                    <LeagueLeaderboard leagueId={ id } />
                    <LeagueStatistics leagueId={ id } />
                    <PlayerStatistics leagueId={ id } />
                </Suspense>
            </main>
        </div>
    );
}