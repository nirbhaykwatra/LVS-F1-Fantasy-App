import {getGrandPrixOptions, getMostRecentGrandPrix, getPlayerLeagueSeasonDetail} from "@/lib/dal/playerInfo";
import { getCurrentUser } from "@/lib/dal/user";
import { GrandPrixOption, GrandPrixSelector } from "@/components/dashboard/GrandPrixSelector";

export async function ScoringBreakdownPanel({ searchParams }: {searchParams: Promise<{round?: string}>}) {
    const user = await getCurrentUser();
    if (!user)
        return null;
    const detail = await getPlayerLeagueSeasonDetail(user.id, 1);
    const recentGP = await getMostRecentGrandPrix();

    const requestedRound = Number((await searchParams)?.round);
    const grandPrixOptions: GrandPrixOption[] = await getGrandPrixOptions();
    const selectedGrandPrix: GrandPrixOption = grandPrixOptions.find((gp) => gp.roundNumber === requestedRound) || { roundNumber: recentGP.roundNumber, name: recentGP.name };

    const breakdown = detail[selectedGrandPrix.roundNumber]?.pointsBreakdown;

    if (!breakdown){
        return (
            <div>
                <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 mt-4">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        <GrandPrixSelector options={grandPrixOptions} selected={selectedGrandPrix} />
                        <h2 className="text-lg font-bold text-foreground">Previous Grand Prix Results</h2>
                    </div>

                    <div className="h-px w-full bg-black/10 dark:bg-white/10" />
                        <p className="text-sm text-foreground/60 text-center py-8">
                            No race data recorded for this week yet.
                        </p>
                </div>
            </div>
        );
    }
    const driverRows: Array<[label: string, entry: typeof breakdown.driver1]> = [
        ["Driver 1", breakdown.driver1],
        ["Driver 2", breakdown.driver2],
        ["Driver 3", breakdown.driver3],
    ];

    const bogeyRows: Array<[label: string, entry: typeof breakdown.wildcard]> = [
        ["Bogey", breakdown.wildcard],
        ["Constructor", breakdown.constructor],
    ];


    return (
        <div>
            <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 mt-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <GrandPrixSelector options={grandPrixOptions} selected={selectedGrandPrix} />
                    <h2 className="text-lg font-bold text-foreground">Previous Grand Prix Results</h2>
                    <div className="flex flex-row gap-2 items-baseline">
                        <p className="text-2xl font-bold text-foreground">{breakdown.total}</p>
                        <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
                            Points
                        </h2>
                    </div>
                </div>

                <div className="h-px w-full bg-black/10 dark:bg-white/10" />
                {breakdown ?
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {driverRows.map(([label, entry]) => (
                                <div key={label} className="flex flex-col gap-2 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-white/5 items-center justify-center">
                                    <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/70">
                                        {label}
                                    </h2>
                                    <h2 className="text-2xl font-black tracking-wide text-brand text-center">
                                        {entry.name}
                                    </h2>
                                    <p className="text-2xl font-semibold uppercase text-foreground">
                                        {entry.points} pts
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {bogeyRows.map(([label, entry]) => (
                                <div key={label} className="flex flex-col gap-2 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-white/5 items-center justify-center">
                                    <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/70">
                                        {label}
                                    </h2>
                                    <h2 className="text-2xl font-black tracking-wide text-brand text-center">
                                        {entry.name}
                                    </h2>
                                    <p className="text-2xl font-semibold uppercase text-foreground">
                                        {entry.points} pts
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                : <p className="text-sm text-foreground/60 text-center py-8">
                        No race data recorded for this week yet.
                    </p>
                }
            </div>
        </div>
    );
}