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
import { getLeagueBySlug } from "@/lib/dal/leagues";
import Link from "next/link";

export default async function LeagueDashboardPage({ searchParams, params }: { searchParams: Promise<{ round?: string }>, params: Promise<{ leagueSlug: string }>} ) {
    const user = await getCurrentUser();
    if (!user) return null;

    const { leagueSlug } = await params;
    const league = await getLeagueBySlug(leagueSlug);
    const id = String(league?.id);

    return (
        <main className="relative z-10 flex flex-1 flex-col gap-8 px-6 sm:px-10 max-w-5xl mx-auto w-full">
            {/* Welcome Section */}
            <div className="flex flex-col gap-2">
                <span className="">
                    <Link
                        href="/dashboard"
                        className="w-fit rounded-full bg-brand/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand"
                    >
                    ← Back to dashboard
                </Link>
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
    );
}