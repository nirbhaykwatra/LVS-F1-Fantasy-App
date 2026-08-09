import {getCurrentUser} from "@/lib/dal/user";
import {getLeagueLeaderboard, getPlayerLeaguesSummary} from "@/lib/dal/playerInfo";

export async function LeagueLeaderboard({ leagueId }: { leagueId: string }) {
    const user = await getCurrentUser();
    if (!user) return null;

    const leagues = await getPlayerLeaguesSummary(user.id);

    const actualLeagueId = leagueId
        ? Number(leagueId)
        : leagues[0]?.leagueId; // default to the (only) league when nothing is selected

    const playerLeagueData = actualLeagueId
        ? await getLeagueLeaderboard(Number(actualLeagueId))
        : null;

    const leagueName = leagues.find(league => league.leagueId === actualLeagueId)?.leagueName ?? "League Not Found";

    const playerRows = playerLeagueData?.playerData ?? [];

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 mt-4">
            <h2 className="text-lg font-bold text-foreground">{leagueName} Leaderboard</h2>
            <div className="h-px w-full bg-black/10 dark:bg-white/10" />
            { playerRows.length > 0 ?
                <table className="w-full border-collapse block md:table [&_td]:px-4 [&_td]:py-2 md:[&_td:first-child]:pl-0 md:[&_td:last-child]:pr-0">
                    <thead className="hidden md:table-header-group">
                    <tr>
                        <th className="text-left">Rank</th>
                        <th className="text-left">Player</th>
                        <th className="text-left">Team</th>
                        <th className="text-left">Points</th>
                    </tr>
                    </thead>
                    <tbody className="block md:table-row-group">
                    {playerRows.map(([playerId, username, teamName, points, rank]) => (
                        <tr
                            key={playerId}
                            className="block md:table-row mb-3 last:mb-0 md:mb-0 rounded-xl border border-black/10 dark:border-white/10 md:border-0 md:rounded-none"
                        >
                            <td className="flex justify-between items-center md:table-cell border-b border-black/5 dark:border-white/5 md:border-0">
                                <span className="font-semibold text-xs uppercase tracking-wide text-foreground/50 md:hidden">Rank</span>
                                <span>{rank}</span>
                            </td>
                            <td className="flex justify-between items-center md:table-cell border-b border-black/5 dark:border-white/5 md:border-0">
                                <span className="font-semibold text-xs uppercase tracking-wide text-foreground/50 md:hidden">Player</span>
                                <span>{username}</span>
                            </td>
                            <td className="flex justify-between items-center md:table-cell border-b border-black/5 dark:border-white/5 md:border-0">
                                <span className="font-semibold text-xs uppercase tracking-wide text-foreground/50 md:hidden">Team</span>
                                <span>{teamName}</span>
                            </td>
                            <td className="flex justify-between items-center md:table-cell">
                                <span className="font-semibold text-xs uppercase tracking-wide text-foreground/50 md:hidden">Points</span>
                                <span>{points}</span>
                            </td>
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