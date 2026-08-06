import {getMostDraftedConstructorForPlayer, getPlayerLeaguesSummary} from "@/lib/dal/dashboard";
import {getCurrentUser} from "@/lib/dal";
import {leagues} from "@/db/schema";


export async function LeagueStatistics({ searchParams }: {searchParams: Promise<{leagueId?: string}>}) {
    const user = await getCurrentUser();
    if (!user) return null;

    const leagues = await getPlayerLeaguesSummary(user.id);

    const rawLeagueId = (await searchParams)?.leagueId;
    const leagueId = rawLeagueId
        ? Number(rawLeagueId)
        : leagues[0]?.leagueId; // default to the (only) league when nothing is selected

    const playerLeagueData = leagueId
        ? await getMostDraftedConstructorForPlayer(user.id, { leagueId })
        : null;

    const playerLeagueStatistics: Array<[statistic: string, value: any]> = [
        ["Most Drafted Constructor", playerLeagueData?.fullName ?? "N/A"],
    ];

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 mt-4">
            <h2 className="text-lg font-bold text-foreground">League Statistics</h2>
            <div className="h-px w-full bg-black/10 dark:bg-white/10" />
            { leagueId ?
                <table>
                    <tbody>
                    {playerLeagueStatistics.map(([stat, value]) => (
                        <tr key={stat}>
                            <td>{stat}</td>
                            <td className="text-right">{value}</td>
                        </tr>
                    ))}
                    </tbody>
                </table> :
                <p className="text-sm text-foreground/60 text-center py-8">
                    No race data recorded for this week yet.
                </p>
            }
        </div>
    );
}