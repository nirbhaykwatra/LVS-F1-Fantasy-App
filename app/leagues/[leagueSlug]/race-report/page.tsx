import { Suspense } from "react";
import { getCurrentUser } from "@/lib/dal/user";
import Link from "next/link";
import {getGrandPrixOptions, getMostRecentGrandPrix} from "@/lib/dal/playerInfo";
import {GrandPrixOption, GrandPrixSelector} from "@/components/dashboard/LeagueDashboardClientComponents";

export default async function RaceReportPage({ searchParams }: { searchParams: Promise<{ round?: string }> }) {
    const user = await getCurrentUser();
    if (!user) return null;

    const recentGP = await getMostRecentGrandPrix();

    const requestedRound = Number((await searchParams)?.round);
    const grandPrixOptions: GrandPrixOption[] = await getGrandPrixOptions();
    let selectedGrandPrix: GrandPrixOption = { roundNumber: 0, name: "No Grand Prix set" };

    if (grandPrixOptions.length > 0) {
        selectedGrandPrix = grandPrixOptions.find((gp) => gp.roundNumber === requestedRound) || { roundNumber: recentGP.roundNumber, name: recentGP.name };
    }

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
                    {/* Replace with Grand Prix name */}
                    <h1 className="text-3xl font-black leading-tight text-foreground">
                        Race Report
                    </h1>
                    <div className="sm:justify-self-end">
                        <Suspense fallback={<div></div>}>
                            {/* Add grands prix dropdown here*/}
                            <GrandPrixSelector options={grandPrixOptions} selected={selectedGrandPrix} />
                        </Suspense>
                    </div>
                </div>

                {/* Add the following sections:
                    1. Selected GP session results (all sessions) if available
                    2. Race facts (league deadlines, sessions datetimes, track temp, weather)
                    3. Track map
                */}

            </div>
        </main>
    );
}