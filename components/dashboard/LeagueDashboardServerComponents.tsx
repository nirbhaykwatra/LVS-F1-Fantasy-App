import Link from "next/link";
import { getCurrentUser } from "@/lib/dal/user";
import {
    getPlayerLeaguesSummary,
    getPlayerTeamMotto,
    getPlayerFromId,
    getGrandPrixOptions,
    getMostRecentGrandPrix,
    getPlayerLeagueSeasonDetail,
    getPlayerTeamName,
    getLeagueLeaderboard
} from "@/lib/dal/playerInfo";
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
} from "@/lib/dal/stats";
import {
    getPlayerMostDraftedConstructor,
    getPlayerMostDraftedDriver,
    getPlayerHighestPointsScoringDriver,
    getPlayerLowestPointsScoringDriver,
    getPlayerBestRound,
    getPlayerWorstRound,
    getPlayerBestAutoAssignedRound,
    getPlayerWorstAutoAssignedRound,
    getPlayerAveragePointsPerRound,
    getPlayerHighestSingleRoundDriverScore,
    getPlayerLowestSingleRoundDriverScore,
} from "@/lib/dal/stats";
import { getPointsText, Statistic } from "@/lib/utils";
import {
    GrandPrixOption,
    GrandPrixSelector,
    LeagueSelector
} from "@/components/dashboard/LeagueDashboardClientComponents";
import {SmallCard} from "@/components/common/UI";

export async function PlayerStatistics({ leagueId }: { leagueId: string }) {
    const user = await getCurrentUser();
    if (!user) return null;

    const leagues = await getPlayerLeaguesSummary(user.id);

    const actualLeagueId = leagueId
        ? Number(leagueId)
        : leagues[0]?.leagueId; // default to the (only) league when nothing is selected

    const player = await getPlayerFromId(user.id);

    const rawStatistics = {
        mostDraftedConstructor: await getPlayerMostDraftedConstructor(user.id, actualLeagueId),
        mostDraftedDriver: await getPlayerMostDraftedDriver(user.id, actualLeagueId),
        highestPointsScoringDriver: await getPlayerHighestPointsScoringDriver(user.id, actualLeagueId),
        lowestPointsScoringDriver: await getPlayerLowestPointsScoringDriver(user.id, actualLeagueId),
        highestSingleRoundDriverScore: await getPlayerHighestSingleRoundDriverScore(user.id, actualLeagueId),
        lowestSingleRoundDriverScore: await getPlayerLowestSingleRoundDriverScore(user.id, actualLeagueId),
        highestScoringRound: await getPlayerBestRound(user.id, actualLeagueId),
        lowestScoringRound: await getPlayerWorstRound(user.id, actualLeagueId),
        averagePointsPerRound: await getPlayerAveragePointsPerRound(user.id, actualLeagueId),
        highestScoringRandomRound: await getPlayerBestAutoAssignedRound(user.id, actualLeagueId),
        lowestScoringRandomRound: await getPlayerWorstAutoAssignedRound(user.id, actualLeagueId)
    }

    const playerStatistics: Statistic[] = [
        { id: "most-drafted-constructor", name: "Most Drafted Constructor", value: rawStatistics.mostDraftedConstructor?.fullName ?? "N/A" },
        { id: "most-drafted-driver", name: "Most Drafted Driver", value: rawStatistics.mostDraftedDriver ? `${rawStatistics.mostDraftedDriver.firstName} ${rawStatistics.mostDraftedDriver.lastName}` : "N/A" },
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
            <h2 className="text-lg font-bold text-foreground">{player?.username ?? "Player Not Found"}&#39;s Statistics</h2>
            <div className="h-px w-full bg-black/10 dark:bg-white/10" />
            { actualLeagueId ?
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

export async function PlayerName({ leagueId }: { leagueId: string }) {
    const user = await getCurrentUser();
    if (!user) return null;

    const leagues = await getPlayerLeaguesSummary(user.id);

    const actualLeagueId = leagueId
        ? Number(leagueId)
        : leagues[0]?.leagueId; // default to the (only) league when nothing is selected

    const playerMotto = await getPlayerTeamMotto(user.id, actualLeagueId);

    return (
        <div>
            <h1 className="text-3xl font-black leading-tight text-foreground">
                Welcome back, {user?.username}
            </h1>
            <p className="text-sm text-foreground/60">
                {playerMotto}
            </p>
        </div>
    );
}

export async function LeagueDropdown({ leagueId }: { leagueId: string }) {
    const user = await getCurrentUser();
    if (!user) return null;
    const leagues = await getPlayerLeaguesSummary(user.id);
    const requestedLeague = Number(leagueId);
    const selectedLeague = leagues.find((league) => league.leagueId === requestedLeague) || leagues[0];

    return (
        <div>
            <LeagueSelector options={leagues} selected={selectedLeague}/>
        </div>
    );
}

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
                <table className="w-full border-collapse block md:table [&_td]:py-2 [&_td]:px-3 md:[&_th]:px-3 md:[&_td:first-child]:pl-0 md:[&_td:last-child]:pr-0 md:[&_th:first-child]:pl-0 md:[&_th:last-child]:pr-0">
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
                            className={`
                            block md:table-row mb-3 md:mb-0 rounded-xl border border-black/10 dark:border-white/10 md:border-0 md:rounded-none 
                            ${rank === 1 ? "text-yellow-500" : ""}
                            `}
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

export async function LeaguesTable() {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    let hasLeagues = false;
    const leaguesSummary = await getPlayerLeaguesSummary(user.id);
    if (leaguesSummary[0]) {
        hasLeagues = true;
    }

    return (
        <div>
            <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 mt-4">
                <h2 className="text-lg font-bold text-foreground">Joined Leagues</h2>
                <div className="h-px w-full bg-black/10 dark:bg-white/10" />

                { hasLeagues ?
                    <table>
                        <thead className="text-left">
                        <tr>
                            <th>League Name</th>
                            <th>Points</th>
                        </tr>
                        </thead>
                        <tbody>
                        {leaguesSummary.map((league) => (
                            <tr key={league.leagueId}>
                                <td>
                                    <Link href={`/leagues/${league.slug}/dashboard`}>
                                            <span className="text-(--color-brand) font-bold hover:underline">
                                                 {league.leagueName}
                                            </span>
                                    </Link>
                                </td>
                                <td>{league.currentPointsTotal}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    :
                    <p className="text-sm text-foreground/60 text-center py-8">
                        No leagues joined yet.
                    </p>
                }
            </div>
        </div>
    )
}

export async function LeagueStatistics({ leagueId }: { leagueId: string }) {
    const user = await getCurrentUser();
    if (!user) return null;

    const leagues = await getPlayerLeaguesSummary(user.id);

    const actualLeagueId = leagueId
        ? Number(leagueId)
        : leagues[0]?.leagueId; // default to the (only) league when nothing is selected

    const leagueName = leagues.find(league => league.leagueId === actualLeagueId)?.leagueName ?? "League Not Found";

    const rawStatistics = {
        mostDraftedConstructor: await getLeagueMostDraftedConstructor(actualLeagueId),
        mostDraftedDriver: await getLeagueMostDraftedDriver(actualLeagueId),
        roundDraftExtremes: await getLeagueRoundDraftExtremes(actualLeagueId),
        highestPointsScoringPlayer: await getLeagueHighestPointsScoringPlayer(actualLeagueId),
        lowestPointsScoringPlayer: await getLeagueLowestPointsScoringPlayer(actualLeagueId),
        highestScoringRound: await getLeagueBestRound(actualLeagueId),
        lowestScoringRound: await getLeagueWorstRound(actualLeagueId),
        averagePointsPerRound: await getLeagueAveragePointsPerRound(actualLeagueId),
        highestScoringRandomRound: await getLeagueBestAutoAssignedRound(actualLeagueId),
        lowestScoringRandomRound: await getLeagueWorstAutoAssignedRound(actualLeagueId),
        playerWithMostRandomDrafts: await getPlayerWithMostAutoAssignedDrafts(actualLeagueId),
    }

    const leagueStatistics: Statistic[] = [
        { id: "most-drafted-constructor", name: "Most Drafted Constructor", value: rawStatistics.mostDraftedConstructor?.fullName ?? "N/A" },
        { id: "most-drafted-driver", name: "Most Drafted Driver", value: rawStatistics.mostDraftedDriver ? `${rawStatistics.mostDraftedDriver.firstName} ${rawStatistics.mostDraftedDriver.lastName}` : "N/A" },
        { id: "highest-points-scoring-player", name: "Highest Points In A Single Weekend",
            value: rawStatistics.highestScoringRound ? `${getPointsText(rawStatistics.highestScoringRound.points)} - ${rawStatistics.highestScoringRound.player.username} - ${rawStatistics.highestScoringRound.round.eventName}` : "N/A" },
        { id: "lowest-points-scoring-player", name: "Lowest Points In A Single Weekend",
            value: rawStatistics.lowestScoringRound ? `${getPointsText(rawStatistics.lowestScoringRound.points)} - ${rawStatistics.lowestScoringRound.player.username} - ${rawStatistics.lowestScoringRound.round.eventName}` : "N/A" },
        { id: "average-points-per-round", name: "Average Points Per Round", value: String(Math.trunc(rawStatistics.averagePointsPerRound * 100) / 100) },
        { id: "highest-random-round", name: "Most Points From Random Pick", value: rawStatistics.highestScoringRandomRound ? `${getPointsText(rawStatistics.highestScoringRandomRound.points)} - ${rawStatistics.highestScoringRandomRound.player.username} - ${rawStatistics.highestScoringRandomRound.round.eventName}` : "N/A" },
        { id: "lowest-random-round", name: "Least Points From Random Pick", value: rawStatistics.lowestScoringRandomRound ? `${getPointsText(rawStatistics.lowestScoringRandomRound.points)} - ${rawStatistics.lowestScoringRandomRound.player.username} - ${rawStatistics.lowestScoringRandomRound.round.eventName}` : "N/A" },
        { id: "highest-random-drafts-player", name: "Most Random Drafts", value: rawStatistics.playerWithMostRandomDrafts?.username ?? "N/A" },
    ];

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 mt-4">
            <h2 className="text-lg font-bold text-foreground">{leagueName} Overall Statistics</h2>
            <div className="h-px w-full bg-black/10 dark:bg-white/10" />
            { actualLeagueId ?
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

export async function ScoringBreakdownPanel({ round }: { round?: string }) {
    const user = await getCurrentUser();
    if (!user)
        return null;
    const detail = await getPlayerLeagueSeasonDetail(user.id, 1);
    const recentGP = await getMostRecentGrandPrix();

    const requestedRound = Number(round);
    const grandPrixOptions: GrandPrixOption[] = await getGrandPrixOptions();
    let selectedGrandPrix: GrandPrixOption = { roundNumber: 0, name: "No Grand Prix set" };
    if (grandPrixOptions.length > 0) {
        selectedGrandPrix = grandPrixOptions.find((gp) => gp.roundNumber === requestedRound) || { roundNumber: recentGP.roundNumber, name: recentGP.name };
    }

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

export async function Summary({ leagueId }: { leagueId: string }) {
    const user = await getCurrentUser();
    if (!user) return null;
    const leagues = await getPlayerLeaguesSummary(user.id);
    const actualLeagueId = leagueId
        ? Number(leagueId)
        : leagues[0]?.leagueId; // default to the (only) league when nothing is selected

    const playerTeamName = await getPlayerTeamName(user.id, actualLeagueId);

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Card 1: Team Info */}
            <SmallCard label="Team Name" value={playerTeamName ?? "Not Set"} />

            {/* Card 2: Points */}
            <SmallCard label="Total Points" value={leagues.find((league) => league.leagueId === actualLeagueId)?.currentPointsTotal.toString() ?? "N/A"} />

            {/* Card 3: Global Rank */}
            <SmallCard label="League Rank" value={leagues.find((league) => league.leagueId === actualLeagueId)?.currentRank.toString() ?? "N/A"} />
        </div>
    );
}

export async function SeasonDropdown({ leagueId }: { leagueId: string }) {
    const user = await getCurrentUser();
    if (!user) return null;
    const leagues = await getPlayerLeaguesSummary(user.id);
    const requestedLeague = Number(leagueId);
    const selectedLeague = leagues.find((league) => league.leagueId === requestedLeague) || leagues[0];

    return (
        <div>
            <LeagueSelector options={leagues} selected={selectedLeague}/>
        </div>
    );
}

