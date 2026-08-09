import Link from "next/link";
import { AnimatedBackground } from "@/components/common/AnimatedBackground";
import SignOutButton from "@/components/dashboard/SignOutButton";
import { PlayerName } from "@/components/dashboard/PlayerName";
import { Suspense } from "react";
import { LeaguesTable } from "@/components/dashboard/LeaguesTable";
import { ScoringBreakdownPanel } from "@/components/dashboard/ScoringBreakdownPanel";
import { Summary } from "@/components/dashboard/Summary";
import { LeagueDropdown } from "@/components/dashboard/LeagueDropdown";
import { PlayerStatistics } from "@/components/dashboard/PlayerStatistics";
import { PlayerNameNav } from "@/components/dashboard/PlayerNameNav";
import { LeagueLeaderboard } from "@/components/dashboard/LeagueLeaderboard";
import { LeagueStatistics } from "@/components/dashboard/LeagueStatistics";
import { getCurrentUser } from "@/lib/dal/user";
import { getPlayerLeaguesSummary } from "@/lib/dal/playerInfo";
import { ButtonRounded } from "@/components/common/Buttons";

export default async function DashboardPage( { searchParams }: { searchParams: Promise<{ round?: string, leagueId?: string }> } ) {
    const user = await getCurrentUser();
    if (!user) return null;

    const leagues = await getPlayerLeaguesSummary(user.id);
    if (leagues.length === 0) {
        return (
            <div className="relative isolate flex min-h-screen flex-col bg-background font-sans">
                <AnimatedBackground />

                <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10 border-b border-black/10 dark:border-white/10 bg-background/50 backdrop-blur-md">
                    <Link href="/" className="flex items-center gap-2 font-mono text-sm font-bold tracking-widest text-foreground">
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
                    <ButtonRounded label="Create a new league" href="/leagues/create" />
                </main>
            </div>
        );
    };

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
                                <LeagueDropdown searchParams={ searchParams } />
                            </Suspense>
                        </div>
                    </div>

                </div>

                <Suspense fallback={<p></p>}>
                    <Summary searchParams={ searchParams }/>
                    <ScoringBreakdownPanel searchParams={ searchParams } />
                    <LeagueLeaderboard searchParams={ searchParams } />
                    <LeagueStatistics searchParams={ searchParams } />
                    <PlayerStatistics searchParams={ searchParams } />
                    <LeaguesTable />
                </Suspense>
            </main>
        </div>
    );
}