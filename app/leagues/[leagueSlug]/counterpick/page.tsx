import { Suspense } from "react";
import { getCurrentUser } from "@/lib/dal/user";
import Link from "next/link";
import {getLeagueBySlug} from "@/lib/dal/leagues";
import {LeagueDropdown} from "@/components/dashboard/LeagueDashboardServerComponents";

export default async function CounterpickPage({ searchParams, params }: { searchParams: Promise<{ round?: string }>, params: Promise<{ leagueSlug: string }>}) {
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
                    <h1 className="text-3xl font-black leading-tight text-foreground">
                        Counterpicks
                    </h1>
                    <div className="sm:justify-self-end">
                        <Suspense fallback={<div></div>}>
                            <LeagueDropdown leagueId={ id } />
                        </Suspense>
                    </div>
                </div>

                {/* Add the following sections:
                    1. Make Counterpick section
                    2. Current counterpick stats (no. of picks made, no. of picks left, current counterpick deadline)
                    3. Currently active counterpicks in the league
                    4. Past counterpicks made
                */}

            </div>
        </main>
    );
}