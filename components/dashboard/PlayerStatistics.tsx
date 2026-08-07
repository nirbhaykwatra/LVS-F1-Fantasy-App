import {getPlayerFromId, getPlayerLeaguesSummary} from "@/lib/dal/playerInfo";
import {getCurrentUser} from "@/lib/dal/user";
import {
    getPlayerMostDraftedConstructor,
    getPlayerMostDraftedDriver,
    getPlayerHighestPointsScoringDriver,
    getPlayerLowestPointsScoringDriver,
    getPlayerBestRound,
    getPlayerWorstRound,
    getPlayerBestAutoAssignedRound,
    getPlayerWorstAutoAssignedRound,
    getPlayerAveragePointsPerRound, getPlayerHighestSingleRoundDriverScore, getPlayerLowestSingleRoundDriverScore,
} from "@/lib/dal";
import {getPointsText, Statistic} from "@/lib/utils";

export async function PlayerStatistics({ searchParams }: {searchParams: Promise<{leagueId?: string}>}) {
    const user = await getCurrentUser();
    if (!user) return null;

    const leagues = await getPlayerLeaguesSummary(user.id);

    const rawLeagueId = (await searchParams)?.leagueId;
    const leagueId = rawLeagueId
        ? Number(rawLeagueId)
        : leagues[0]?.leagueId; // default to the (only) league when nothing is selected

    const player = await getPlayerFromId(user.id);

    const rawStatistics = {
        mostDraftedConstructor: await getPlayerMostDraftedConstructor(user.id, leagueId),
        mostDraftedDriver: await getPlayerMostDraftedDriver(user.id, leagueId),
        highestPointsScoringDriver: await getPlayerHighestPointsScoringDriver(user.id, leagueId),
        lowestPointsScoringDriver: await getPlayerLowestPointsScoringDriver(user.id, leagueId),
        highestSingleRoundDriverScore: await getPlayerHighestSingleRoundDriverScore(user.id, leagueId),
        lowestSingleRoundDriverScore: await getPlayerLowestSingleRoundDriverScore(user.id, leagueId),
        highestScoringRound: await getPlayerBestRound(user.id, leagueId),
        lowestScoringRound: await getPlayerWorstRound(user.id, leagueId),
        averagePointsPerRound: await getPlayerAveragePointsPerRound(user.id, leagueId),
        highestScoringRandomRound: await getPlayerBestAutoAssignedRound(user.id, leagueId),
        lowestScoringRandomRound: await getPlayerWorstAutoAssignedRound(user.id, leagueId)
    }

    const playerStatistics: Statistic[] = [
        { id: "most-drafted-constructor", name: "Most Drafted Constructor", value: rawStatistics.mostDraftedConstructor.fullName },
        { id: "most-drafted-driver", name: "Most Drafted Driver", value: `${rawStatistics.mostDraftedDriver.firstName} ${rawStatistics.mostDraftedDriver.lastName}` },
        { id: "highest-points-scoring-driver", name: "Most Successful Drafted Driver",
            value: rawStatistics.highestPointsScoringDriver ? `${getPointsText(rawStatistics.highestPointsScoringDriver.totalPointsContributed)} - ${rawStatistics.highestPointsScoringDriver.firstName} ${rawStatistics.highestPointsScoringDriver.lastName}` : "N/A" },
        { id: "lowest-points-scoring-driver", name: "Least Successful Drafted Driver",
            value: rawStatistics.lowestPointsScoringDriver ? `${getPointsText(rawStatistics.lowestPointsScoringDriver.totalPointsContributed)} - ${rawStatistics.lowestPointsScoringDriver.firstName} ${rawStatistics.lowestPointsScoringDriver.lastName}` : "N/A" },
        { id: "highest-points-scoring-driver-single-round", name: "Most Points Scored By A Driver In A Round",
            value: rawStatistics.highestSingleRoundDriverScore ?
                `${getPointsText(rawStatistics.highestSingleRoundDriverScore.pointsScored)} - 
                ${rawStatistics.highestSingleRoundDriverScore.firstName} ${rawStatistics.highestSingleRoundDriverScore.lastName}` : "N/A" },
        { id: "lowest-points-scoring-driver-single-round", name: "Least Points Scored By A Driver In A Round",
            value: rawStatistics.lowestSingleRoundDriverScore ?
                `${getPointsText(rawStatistics.lowestSingleRoundDriverScore.pointsScored)} - 
                ${rawStatistics.lowestSingleRoundDriverScore.firstName} ${rawStatistics.lowestSingleRoundDriverScore.lastName}` : "N/A" },
        { id: "average-points-per-round", name: "Average Points Per Round", value: String(Math.trunc(rawStatistics.averagePointsPerRound * 100) / 100) },
        { id: "highest-random-round", name: "Most Points From A Random Draft", value: rawStatistics.highestScoringRandomRound ? `${getPointsText(rawStatistics.highestScoringRandomRound.points)} - ${rawStatistics.highestScoringRandomRound.player.username} - ${rawStatistics.highestScoringRandomRound.round.eventName}` : "No random drafts made" },
        { id: "lowest-random-round", name: "Least Points From A Random Draft", value: rawStatistics.lowestScoringRandomRound ? `${getPointsText(rawStatistics.lowestScoringRandomRound.points)} - ${rawStatistics.lowestScoringRandomRound.player.username} - ${rawStatistics.lowestScoringRandomRound.round.eventName}` : "No random drafts made" },
    ];

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 mt-4">
            <h2 className="text-lg font-bold text-foreground">{player?.username ?? "Player Not Found"}'s Statistics</h2>
            <div className="h-px w-full bg-black/10 dark:bg-white/10" />
            { leagueId ?
                <table className="w-full border-collapse block md:table [&_td]:px-4 [&_td]:py-2 md:[&_td:first-child]:pl-0 md:[&_td:last-child]:pr-0">
                    <tbody className="block md:table-row-group">
                    {playerStatistics.map((stat) => (
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