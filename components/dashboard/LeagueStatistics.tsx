import {getPlayerLeaguesSummary} from "@/lib/dal/playerInfo";
import {getCurrentUser} from "@/lib/dal/user";
import {
    getLeagueMostDraftedConstructor,
    getLeagueMostDraftedDriver,
    getLeagueRoundDraftExtremes,
    getLeagueHighestPointsScoringPlayer,
    getLeagueLowestPointsScoringPlayer,
    getLeagueBestRound,
    getLeagueWorstRound,
    getLeagueAveragePointsPerRound,
    getLeagueBestAutoAssignedRound,
    getLeagueWorstAutoAssignedRound,
    getPlayerWithMostAutoAssignedDrafts,
} from "@/lib/dal";
import {getPointsText, Statistic} from "@/lib/utils";

export async function LeagueStatistics({ searchParams }: {searchParams: Promise<{leagueId?: string}>}) {
    const user = await getCurrentUser();
    if (!user) return null;

    const leagues = await getPlayerLeaguesSummary(user.id);

    const rawLeagueId = (await searchParams)?.leagueId;
    const leagueId = rawLeagueId
        ? Number(rawLeagueId)
        : leagues[0]?.leagueId; // default to the (only) league when nothing is selected

    const leagueName = leagues.find(league => league.leagueId === leagueId)?.leagueName ?? "League Not Found";

    const rawStatistics = {
        mostDraftedConstructor: await getLeagueMostDraftedConstructor(leagueId),
        mostDraftedDriver: await getLeagueMostDraftedDriver(leagueId),
        roundDraftExtremes: await getLeagueRoundDraftExtremes(leagueId),
        highestPointsScoringPlayer: await getLeagueHighestPointsScoringPlayer(leagueId),
        lowestPointsScoringPlayer: await getLeagueLowestPointsScoringPlayer(leagueId),
        highestScoringRound: await getLeagueBestRound(leagueId),
        lowestScoringRound: await getLeagueWorstRound(leagueId),
        averagePointsPerRound: await getLeagueAveragePointsPerRound(leagueId),
        highestScoringRandomRound: await getLeagueBestAutoAssignedRound(leagueId),
        lowestScoringRandomRound: await getLeagueWorstAutoAssignedRound(leagueId),
        playerWithMostRandomDrafts: await getPlayerWithMostAutoAssignedDrafts(leagueId),
    }

    const leagueStatistics: Statistic[] = [
        { id: "most-drafted-constructor", name: "Most Drafted Constructor", value: rawStatistics.mostDraftedConstructor.fullName },
        { id: "most-drafted-driver", name: "Most Drafted Driver", value: `${rawStatistics.mostDraftedDriver.firstName} ${rawStatistics.mostDraftedDriver.lastName}` },
        { id: "highest-points-scoring-player", name: "Highest Points In A Single Weekend",
            value: rawStatistics.highestPointsScoringPlayer.username ? `${getPointsText(rawStatistics.highestScoringRound.points)} - ${rawStatistics.highestScoringRound.player.username} - ${rawStatistics.highestScoringRound.round.eventName}` : "N/A" },
        { id: "lowest-points-scoring-player", name: "Lowest Points In A Single Weekend",
            value: rawStatistics.lowestPointsScoringPlayer.username ? `${getPointsText(rawStatistics.lowestScoringRound.points)} - ${rawStatistics.lowestScoringRound.player.username} - ${rawStatistics.lowestScoringRound.round.eventName}` : "N/A" },
        { id: "average-points-per-round", name: "Average Points Per Round", value: String(Math.trunc(rawStatistics.averagePointsPerRound * 100) / 100) },
        { id: "highest-random-round", name: "Most Points From Random Pick", value: rawStatistics.highestScoringRandomRound ? `${getPointsText(rawStatistics.highestScoringRandomRound.points)} - ${rawStatistics.highestScoringRandomRound.player.username} - ${rawStatistics.highestScoringRandomRound.round.eventName}` : "N/A" },
        { id: "lowest-random-round", name: "Least Points From Random Pick", value: rawStatistics.lowestScoringRandomRound ? `${getPointsText(rawStatistics.lowestScoringRandomRound.points)} - ${rawStatistics.lowestScoringRandomRound.player.username} - ${rawStatistics.lowestScoringRandomRound.round.eventName}` : "N/A" },
        { id: "highest-random-drafts-player", name: "Most Random Drafts", value: rawStatistics.playerWithMostRandomDrafts.username ?? "N/A" },
    ];

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 mt-4">
            <h2 className="text-lg font-bold text-foreground">{leagueName} Overall Statistics</h2>
            <div className="h-px w-full bg-black/10 dark:bg-white/10" />
            { leagueId ?
                <table className="w-full border-collapse block md:table [&_td]:px-4 [&_td]:py-2 md:[&_td:first-child]:pl-0 md:[&_td:last-child]:pr-0">
                    <tbody className="block md:table-row-group">
                    {leagueStatistics.map((stat) => (
                        <tr
                            key={stat.id}
                            className="block md:table-row mb-3 last:mb-0 md:mb-0 rounded-xl border border-black/10 dark:border-white/10 md:border-0 md:rounded-none"
                        >
                            <td className="flex justify-between text-left md:table-cell border-b border-black/5 dark:border-white/5 md:border-0">
                                <span className="font-semibold text-xs uppercase tracking-wide text-foreground/50 md:hidden">Stat</span>
                                <span className="text-[clamp(0.75rem,2vw,1rem)]">{stat.name}</span>
                            </td>
                            <td className="flex justify-between text-right text-brand font-bold md:table-cell border-b border-black/5 dark:border-white/5 md:border-0">
                                <span className="font-semibold text-xs uppercase tracking-wide text-foreground/50 md:hidden">Value</span>
                                <span className="text-[clamp(0.75rem,2vw,1rem)]">{stat.value}</span>
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