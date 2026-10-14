import { Suspense } from "react";
import { getCurrentUser } from "@/lib/dal/user";
import Link from "next/link";
import {getLeagueBySlug} from "@/lib/dal/leagues";
import {LeagueDropdown} from "@/components/dashboard/LeagueDashboardServerComponents";

export default async function PlayerProfilePage({ searchParams, params }: { searchParams: Promise<{ player?: string }>, params: Promise<{ leagueSlug: string }>}) {
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
                    {/* Show selected player's name and team */}
                    <h1 className="text-3xl font-black leading-tight text-foreground">
                        Player Profile
                    </h1>
                    <div className="sm:justify-self-end">
                        <Suspense fallback={<div></div>}>
                            {/* Add a current players dropdown */}
                            <LeagueDropdown leagueId={ id } />
                        </Suspense>
                    </div>
                </div>

                {/* Add the following sections:
                    1. Selected player points graph (add options for cumulative, etc)
                    2. Stats (most selected driver, team, number of times drafted, etc)
                    3. Compare with another player (with graphs)
                    4. Wheel Knowledge (player's drafts, etc compared to the real life outcomes a.k.a. how accurate was the player)
                */}

            </div>
        </main>
    );
}