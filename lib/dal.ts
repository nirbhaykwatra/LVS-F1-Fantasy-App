/**
 * Data Access Layer — League & Player Statistics
 * ------------------------------------------------
 * Read-focused functions for pulling statistical data about leagues and the
 * players inside them. Organized into categories:
 *
 *   1. League Overview / Summary
 *   2. League & Round Leaderboards
 *   3. Player Performance Within a League
 *   4. Player Round-by-Round Detail (drafts + scores combined)
 *   5. Draft Activity
 *   6. Counterpick Activity
 *   7. Exhaustion Tracking (drivers & constructors)
 *   8. League Membership
 *   9. League Statistical Metrics
 *  10. Player Statistical Metrics
 *
 * Sections 1–3 lean on the pre-aggregated SQL views already defined in the
 * schema (v_league_summary, v_league_leaderboard, v_grand_prix_leaderboard,
 * v_player_league_stats, v_player_leagues, v_player_season_detail) since
 * they already encode the correct joins/aggregations — no need to
 * reimplement that logic in application code.
 */

import { and, asc, desc, eq, SQL, sql } from "drizzle-orm";
import { db } from "@/db";
import {
    leagues,
    players,
    playerLeagues,
    drafts,
    counterpicks,
    counterpickUsage,
    driverExhaustion,
    constructorExhaustion,
    drivers,
    constructors,
    grandsPrix,
    playerRoundScores,
    vLeagueSummary,
    vLeagueLeaderboard,
    vGrandPrixLeaderboard,
    vPlayerLeagueStats,
    vPlayerLeagues,
    vPlayerSeasonDetail,
} from "@/db/schema";


// ============================================================================
// 0. HELPERS
// ============================================================================

type RoundExtremeOptions = {
    leagueId: number;
    playerId?: number;
    isAutoAssigned: boolean;
    direction: "best" | "worst";
};

type DriverPointsRow = {
    driverId: number;
    code: string;
    firstName: string;
    lastName: string;
    totalPointsContributed: number;
};

type DriverSingleRoundRow = {
    driverId: number;
    code: string;
    firstName: string;
    lastName: string;
    grandPrixId: number;
    roundNumber: number;
    eventName: string;
    pointsScored: number;
};

/**
 * Shared query for finding a single best/worst-scoring round, optionally
 * scoped to one player, filtered by whether the draft was auto-assigned.
 */
async function getRoundExtreme({ leagueId, playerId, isAutoAssigned, direction }: RoundExtremeOptions) {
    const conditions: SQL[] = [
        eq(playerRoundScores.leagueId, leagueId),
        eq(drafts.isAutoAssigned, isAutoAssigned),
    ];

    if (playerId !== undefined) {
        conditions.push(eq(playerRoundScores.playerId, playerId));
    }

    const [result] = await db
        .select({
            player: {
                id: players.id,
                username: players.username,
            },
            round: {
                id: grandsPrix.id,
                roundNumber: grandsPrix.roundNumber,
                eventName: grandsPrix.eventName,
                seasonId: grandsPrix.seasonId,
            },
            points: playerRoundScores.totalPoints,
        })
        .from(playerRoundScores)
        .innerJoin(players, eq(players.id, playerRoundScores.playerId))
        .innerJoin(grandsPrix, eq(grandsPrix.id, playerRoundScores.grandPrixId))
        .innerJoin(
            drafts,
            and(
                eq(drafts.playerId, playerRoundScores.playerId),
                eq(drafts.leagueId, playerRoundScores.leagueId),
                eq(drafts.grandPrixId, playerRoundScores.grandPrixId),
            ),
        )
        .where(and(...conditions))
        .orderBy(direction === "best" ? desc(playerRoundScores.totalPoints) : asc(playerRoundScores.totalPoints))
        .limit(1);

    return result ?? null;
}

// Shared CTE: unnests each draft's 4 slots into individual (driver, round, points) rows,
// pairing each breakdown_json slot with the matching driverXId column.
function driverRoundPointsCte(playerId: number, leagueId: number) {
    const leagueFilter = leagueId ? sql`AND d.league_id = ${leagueId}` : sql``;

    return sql`
        driver_round_points AS (
            SELECT d.driver1_id AS driver_id, d.grand_prix_id,
                   (prs.breakdown_json -> 'driver1' ->> 'points')::int AS points
            FROM drafts d
            JOIN player_round_scores prs
                ON prs.player_id = d.player_id AND prs.league_id = d.league_id AND prs.grand_prix_id = d.grand_prix_id
            WHERE d.player_id = ${playerId} ${leagueFilter}
            UNION ALL
            SELECT d.driver2_id, d.grand_prix_id,
                   (prs.breakdown_json -> 'driver2' ->> 'points')::int
            FROM drafts d
            JOIN player_round_scores prs
                ON prs.player_id = d.player_id AND prs.league_id = d.league_id AND prs.grand_prix_id = d.grand_prix_id
            WHERE d.player_id = ${playerId} ${leagueFilter}
            UNION ALL
            SELECT d.driver3_id, d.grand_prix_id,
                   (prs.breakdown_json -> 'driver3' ->> 'points')::int
            FROM drafts d
            JOIN player_round_scores prs
                ON prs.player_id = d.player_id AND prs.league_id = d.league_id AND prs.grand_prix_id = d.grand_prix_id
            WHERE d.player_id = ${playerId} ${leagueFilter}
            UNION ALL
            SELECT d.wildcard_id, d.grand_prix_id,
                   (prs.breakdown_json -> 'wildcard' ->> 'points')::int
            FROM drafts d
            JOIN player_round_scores prs
                ON prs.player_id = d.player_id AND prs.league_id = d.league_id AND prs.grand_prix_id = d.grand_prix_id
            WHERE d.player_id = ${playerId} ${leagueFilter}
        )
    `;
}

// ============================================================================
// 1. LEAGUE OVERVIEW / SUMMARY
// ============================================================================

/** High-level summary for a single league: player count, rounds, etc. */
export async function getLeagueSummary(leagueId: number) {
    const [summary] = await db
        .select()
        .from(vLeagueSummary)
        .where(eq(vLeagueSummary.leagueId, leagueId));
    return summary ?? null;
}

/** Summaries for every league, optionally scoped to one season. */
export async function getAllLeagueSummaries(seasonId?: number) {
    const query = db.select().from(vLeagueSummary);
    if (seasonId !== undefined) {
        return query.where(eq(vLeagueSummary.seasonId, seasonId));
    }
    return query;
}

/** Raw league row (name, invite code, counterpick limit, etc.) */
export async function getLeagueById(leagueId: number) {
    const [league] = await db.select().from(leagues).where(eq(leagues.id, leagueId));
    return league ?? null;
}

/** All leagues belonging to a given season. */
export async function getLeaguesForSeason(seasonId: number) {
    return db.select().from(leagues).where(eq(leagues.seasonId, seasonId));
}

// ============================================================================
// 2. LEAGUE & ROUND LEADERBOARDS
// ============================================================================

/** Full standings for a league, ranked by total points descending. */
export async function getLeagueLeaderboard(leagueId: number) {
    return db
        .select()
        .from(vLeagueLeaderboard)
        .where(eq(vLeagueLeaderboard.leagueId, leagueId))
        .orderBy(vLeagueLeaderboard.rank);
}

/** Top N players in a league (e.g. for a podium/summary widget). */
export async function getTopPlayersInLeague(leagueId: number, limit = 3) {
    return db
        .select()
        .from(vLeagueLeaderboard)
        .where(eq(vLeagueLeaderboard.leagueId, leagueId))
        .orderBy(vLeagueLeaderboard.rank)
        .limit(limit);
}

/** Leaderboard for one specific Grand Prix round within a league. */
export async function getGrandPrixLeaderboard(leagueId: number, grandPrixId: number) {
    return db
        .select()
        .from(vGrandPrixLeaderboard)
        .where(
            and(
                eq(vGrandPrixLeaderboard.leagueId, leagueId),
                eq(vGrandPrixLeaderboard.grandPrixId, grandPrixId),
            ),
        )
        .orderBy(vGrandPrixLeaderboard.rank);
}

/** Per-round leaderboards for every round in a league (round-by-round history). */
export async function getAllRoundLeaderboardsForLeague(leagueId: number) {
    return db
        .select()
        .from(vGrandPrixLeaderboard)
        .where(eq(vGrandPrixLeaderboard.leagueId, leagueId))
        .orderBy(vGrandPrixLeaderboard.roundNumber, vGrandPrixLeaderboard.rank);
}

// ============================================================================
// 3. PLAYER PERFORMANCE WITHIN A LEAGUE
// ============================================================================

/** Aggregated stats (total/avg/best/worst points, current rank) for one player in one league. */
export async function getPlayerLeagueStats(playerId: number, leagueId: number) {
    const [stats] = await db
        .select()
        .from(vPlayerLeagueStats)
        .where(and(eq(vPlayerLeagueStats.playerId, playerId), eq(vPlayerLeagueStats.leagueId, leagueId)));
    return stats ?? null;
}

/** Same aggregated stats for every player in a league (drives a stats table view). */
export async function getAllPlayerStatsInLeague(leagueId: number) {
    return db
        .select()
        .from(vPlayerLeagueStats)
        .where(eq(vPlayerLeagueStats.leagueId, leagueId))
        .orderBy(desc(vPlayerLeagueStats.totalPoints));
}

/** Every league a player belongs to, with per-league totals — good for a player profile page. */
export async function getPlayerLeagueMemberships(playerId: number) {
    return db
        .select()
        .from(vPlayerLeagues)
        .where(eq(vPlayerLeagues.playerId, playerId))
        .orderBy(desc(vPlayerLeagues.joinedAt));
}

/** A single player's current rank + total points within a league (lightweight subset of stats). */
export async function getPlayerRankInLeague(playerId: number, leagueId: number) {
    const [row] = await db
        .select({
            playerId: vPlayerLeagueStats.playerId,
            currentRank: vPlayerLeagueStats.currentRank,
            totalPoints: vPlayerLeagueStats.totalPoints,
        })
        .from(vPlayerLeagueStats)
        .where(and(eq(vPlayerLeagueStats.playerId, playerId), eq(vPlayerLeagueStats.leagueId, leagueId)));
    return row ?? null;
}

// ============================================================================
// 4. PLAYER ROUND-BY-ROUND DETAIL
// ============================================================================

/** Full round-by-round breakdown for a player in a league: score + drafted lineup per GP. */
export async function getPlayerSeasonDetail(playerId: number, leagueId: number) {
    return db
        .select()
        .from(vPlayerSeasonDetail)
        .where(and(eq(vPlayerSeasonDetail.playerId, playerId), eq(vPlayerSeasonDetail.leagueId, leagueId)))
        .orderBy(vPlayerSeasonDetail.roundNumber);
}

/**
 * Same breakdown, but limited to one specific round (single race weekend view).
 * The view keys rounds by `roundNumber` rather than `grandPrixId`, so this
 * looks up the round number first, then filters the view by it.
 */
export async function getPlayerRoundDetail(playerId: number, leagueId: number, grandPrixId: number) {
    const [gp] = await db
        .select({ roundNumber: grandsPrix.roundNumber })
        .from(grandsPrix)
        .where(eq(grandsPrix.id, grandPrixId));
    if (!gp) return null;

    const [row] = await db
        .select()
        .from(vPlayerSeasonDetail)
        .where(
            and(
                eq(vPlayerSeasonDetail.playerId, playerId),
                eq(vPlayerSeasonDetail.leagueId, leagueId),
                eq(vPlayerSeasonDetail.roundNumber, gp.roundNumber),
            ),
        );
    return row ?? null;
}

// ============================================================================
// 5. DRAFT ACTIVITY
// ============================================================================

/** A player's submitted draft (3 drivers + wildcard + constructor) for one round. */
export async function getPlayerDraftForRound(playerId: number, leagueId: number, grandPrixId: number) {
    const [draft] = await db
        .select()
        .from(drafts)
        .where(
            and(
                eq(drafts.playerId, playerId),
                eq(drafts.leagueId, leagueId),
                eq(drafts.grandPrixId, grandPrixId),
            ),
        );
    return draft ?? null;
}

/** Full draft history for a player within a league, most recent first. */
export async function getPlayerDraftHistory(playerId: number, leagueId: number) {
    return db
        .select()
        .from(drafts)
        .where(and(eq(drafts.playerId, playerId), eq(drafts.leagueId, leagueId)))
        .orderBy(desc(drafts.createdAt));
}

/** Every player's draft for a given round in a league — useful for a "this week's picks" view. */
export async function getLeagueDraftsForRound(leagueId: number, grandPrixId: number) {
    return db
        .select({
            playerId: drafts.playerId,
            username: players.username,
            driver1Id: drafts.driver1Id,
            driver2Id: drafts.driver2Id,
            driver3Id: drafts.driver3Id,
            wildcardId: drafts.wildcardId,
            constructorId: drafts.constructorId,
            isAutoAssigned: drafts.isAutoAssigned,
        })
        .from(drafts)
        .innerJoin(players, eq(players.id, drafts.playerId))
        .where(and(eq(drafts.leagueId, leagueId), eq(drafts.grandPrixId, grandPrixId)));
}

/** How often each driver has been picked as a "main" vs. "bogey"/wildcard for a given player+league. */
export async function getPlayerDriverPickFrequency(playerId: number, leagueId: number) {
    return db
        .select({
            driverId: drivers.id,
            code: drivers.code,
            timesAsMain: sql<number>`count(*) filter (where ${drafts.driver1Id} = ${drivers.id} or ${drafts.driver2Id} = ${drivers.id} or ${drafts.driver3Id} = ${drivers.id})`,
            timesAsWildcard: sql<number>`count(*) filter (where ${drafts.wildcardId} = ${drivers.id})`,
        })
        .from(drafts)
        .innerJoin(
            drivers,
            sql`${drivers.id} in (${drafts.driver1Id}, ${drafts.driver2Id}, ${drafts.driver3Id}, ${drafts.wildcardId})`,
        )
        .where(and(eq(drafts.playerId, playerId), eq(drafts.leagueId, leagueId)))
        .groupBy(drivers.id, drivers.code);
}

// ============================================================================
// 6. COUNTERPICK ACTIVITY
// ============================================================================

/** How many counterpicks a player has used this season in a league, vs. their limit. */
export async function getPlayerCounterpickUsage(playerId: number, leagueId: number, seasonId: number) {
    const [usage] = await db
        .select()
        .from(counterpickUsage)
        .where(
            and(
                eq(counterpickUsage.playerId, playerId),
                eq(counterpickUsage.leagueId, leagueId),
                eq(counterpickUsage.seasonId, seasonId),
            ),
        );
    return usage ?? null;
}

/** All counterpicks a player has made in a league (their outgoing picks). */
export async function getCounterpicksMadeByPlayer(playerId: number, leagueId: number) {
    return db
        .select()
        .from(counterpicks)
        .where(and(eq(counterpicks.pickingPlayerId, playerId), eq(counterpicks.leagueId, leagueId)))
        .orderBy(desc(counterpicks.createdAt));
}

/** All counterpicks made *against* a player in a league (incoming picks). */
export async function getCounterpicksAgainstPlayer(playerId: number, leagueId: number) {
    return db
        .select()
        .from(counterpicks)
        .where(and(eq(counterpicks.targetPlayerId, playerId), eq(counterpicks.leagueId, leagueId)))
        .orderBy(desc(counterpicks.createdAt));
}

/** All counterpick activity across a league for one round (who targeted whom, and which driver). */
export async function getLeagueCounterpicksForRound(leagueId: number, grandPrixId: number) {
    return db
        .select()
        .from(counterpicks)
        .where(and(eq(counterpicks.leagueId, leagueId), eq(counterpicks.grandPrixId, grandPrixId)));
}

// ============================================================================
// 7. EXHAUSTION TRACKING (drivers & constructors)
// ============================================================================

/** A player's driver-exhaustion state across a league (consecutive-use tracking). */
export async function getPlayerDriverExhaustion(playerId: number, leagueId: number) {
    return db
        .select()
        .from(driverExhaustion)
        .where(and(eq(driverExhaustion.playerId, playerId), eq(driverExhaustion.leagueId, leagueId)));
}

/** Only the drivers currently exhausted (unpickable) for a player in a league. */
export async function getPlayerExhaustedDrivers(playerId: number, leagueId: number) {
    return db
        .select()
        .from(driverExhaustion)
        .where(
            and(
                eq(driverExhaustion.playerId, playerId),
                eq(driverExhaustion.leagueId, leagueId),
                eq(driverExhaustion.isExhausted, true),
            ),
        );
}

/** A player's constructor-exhaustion state across a league. */
export async function getPlayerConstructorExhaustion(playerId: number, leagueId: number) {
    return db
        .select()
        .from(constructorExhaustion)
        .where(and(eq(constructorExhaustion.playerId, playerId), eq(constructorExhaustion.leagueId, leagueId)));
}

/** Only the constructors currently exhausted (unpickable) for a player in a league. */
export async function getPlayerExhaustedConstructors(playerId: number, leagueId: number) {
    return db
        .select()
        .from(constructorExhaustion)
        .where(
            and(
                eq(constructorExhaustion.playerId, playerId),
                eq(constructorExhaustion.leagueId, leagueId),
                eq(constructorExhaustion.isExhausted, true),
            ),
        );
}

/** League-wide exhaustion snapshot — every player's exhausted drivers, joined with names. */
export async function getLeagueDriverExhaustionOverview(leagueId: number) {
    return db
        .select({
            playerId: driverExhaustion.playerId,
            username: players.username,
            driverId: drivers.id,
            driverCode: drivers.code,
            consecutiveUses: driverExhaustion.consecutiveUses,
            isExhausted: driverExhaustion.isExhausted,
        })
        .from(driverExhaustion)
        .innerJoin(players, eq(players.id, driverExhaustion.playerId))
        .innerJoin(drivers, eq(drivers.id, driverExhaustion.driverId))
        .where(eq(driverExhaustion.leagueId, leagueId));
}

/** League-wide exhaustion snapshot — every player's exhausted constructors, joined with names. */
export async function getLeagueConstructorExhaustionOverview(leagueId: number) {
    return db
        .select({
            playerId: constructorExhaustion.playerId,
            username: players.username,
            constructorId: constructors.id,
            constructorName: constructors.shortName,
            consecutiveUses: constructorExhaustion.consecutiveUses,
            isExhausted: constructorExhaustion.isExhausted,
        })
        .from(constructorExhaustion)
        .innerJoin(players, eq(players.id, constructorExhaustion.playerId))
        .innerJoin(constructors, eq(constructors.id, constructorExhaustion.constructorId))
        .where(eq(constructorExhaustion.leagueId, leagueId));
}

// ============================================================================
// 8. LEAGUE MEMBERSHIP
// ============================================================================

/** Roster of a league: players, team names, roles, join dates. */
export async function getLeagueMembers(leagueId: number) {
    return db
        .select({
            playerId: playerLeagues.playerId,
            username: players.username,
            teamName: playerLeagues.teamName,
            teamMotto: playerLeagues.teamMotto,
            role: playerLeagues.role,
            joinedAt: playerLeagues.joinedAt,
        })
        .from(playerLeagues)
        .innerJoin(players, eq(players.id, playerLeagues.playerId))
        .where(eq(playerLeagues.leagueId, leagueId))
        .orderBy(playerLeagues.joinedAt);
}

/** A single player's membership record in a league (team name, role, join date). */
export async function getPlayerLeagueMembership(playerId: number, leagueId: number) {
    const [membership] = await db
        .select()
        .from(playerLeagues)
        .where(and(eq(playerLeagues.playerId, playerId), eq(playerLeagues.leagueId, leagueId)));
    return membership ?? null;
}

/** League owner(s) — players with the 'owner' role. */
export async function getLeagueOwners(leagueId: number) {
    return db
        .select({
            playerId: playerLeagues.playerId,
            username: players.username,
        })
        .from(playerLeagues)
        .innerJoin(players, eq(players.id, playerLeagues.playerId))
        .where(and(eq(playerLeagues.leagueId, leagueId), eq(playerLeagues.role, "owner")));
}

export async function joinLeagueByInviteCode(id: number, code: string, p0: {
    teamName: string;
    teamMotto: string;
}) {

    const leagueId = 123;
    return { leagueId }
}

// ============================================================================
// 9. LEAGUE STATISTICAL METRICS
// ============================================================================

/** Most drafted driver across all rounds in a specific league. */
export async function getLeagueMostDraftedDriver(leagueId: number) {
    const [result] = await db
        .select({
            driverId: drivers.id,
            code: drivers.code,
            firstName: drivers.firstName,
            lastName: drivers.lastName,
            draftCount: sql<number>`count(*)`,
        })
        .from(drafts)
        .innerJoin(
            drivers,
            sql`${drivers.id} in (${drafts.driver1Id}, ${drafts.driver2Id}, ${drafts.driver3Id}, ${drafts.wildcardId})`
        )
        .where(eq(drafts.leagueId, leagueId))
        .groupBy(drivers.id, drivers.code, drivers.firstName, drivers.lastName)
        .orderBy(desc(sql`count(*)`))
        .limit(1);

    return result ?? null;
}

/** Most drafted constructor across all rounds in a specific league. */
export async function getLeagueMostDraftedConstructor(leagueId: number) {
    const [result] = await db
        .select({
            constructorId: constructors.id,
            shortName: constructors.shortName,
            fullName: constructors.fullName,
            draftCount: sql<number>`count(*)`,
        })
        .from(drafts)
        .innerJoin(constructors, eq(constructors.id, drafts.constructorId))
        .where(eq(drafts.leagueId, leagueId))
        .groupBy(constructors.id, constructors.shortName, constructors.fullName)
        .orderBy(desc(sql`count(*)`))
        .limit(1);

    return result ?? null;
}

/** Highest points-scoring player in a specific league. */
export async function getLeagueHighestPointsScoringPlayer(leagueId: number) {
    const [result] = await db
        .select({
            playerId: vPlayerLeagueStats.playerId,
            username: vPlayerLeagueStats.username,
            teamName: vPlayerLeagueStats.teamName,
            bestRoundScore: vPlayerLeagueStats.bestRoundScore,
        })
        .from(vPlayerLeagueStats)
        .where(eq(vPlayerLeagueStats.leagueId, leagueId))
        .orderBy(desc(vPlayerLeagueStats.bestRoundScore))
        .limit(1);

    return result ?? null;
}

/** Lowest points-scoring player in a specific league. */
export async function getLeagueLowestPointsScoringPlayer(leagueId: number) {
    const [result] = await db
        .select({
            playerId: vPlayerLeagueStats.playerId,
            username: vPlayerLeagueStats.username,
            teamName: vPlayerLeagueStats.teamName,
            worstRoundScore: vPlayerLeagueStats.worstRoundScore,
        })
        .from(vPlayerLeagueStats)
        .where(eq(vPlayerLeagueStats.leagueId, leagueId))
        .orderBy(asc(vPlayerLeagueStats.worstRoundScore))
        .limit(1);

    return result ?? null;
}

/**
 * The single highest-scoring round by any player within a league,
 * excluding rounds where the draft was auto-assigned.
 */
export function getLeagueBestRound(leagueId: number) {
    return getRoundExtreme({ leagueId, isAutoAssigned: false, direction: "best" });
}

/**
 * The single lowest-scoring round by any player within a league,
 * excluding rounds where the draft was auto-assigned.
 */
export function getLeagueWorstRound(leagueId: number) {
    return getRoundExtreme({ leagueId, isAutoAssigned: false, direction: "worst" });
}

/** Average points scored per player per round across an entire league. */
export async function getLeagueAveragePointsPerRound(leagueId: number) {
    const [result] = await db
        .select({
            leagueId: playerRoundScores.leagueId,
            avgPointsPerRound: sql<number>`COALESCE(avg(${playerRoundScores.totalPoints}), 0)`,
        })
        .from(playerRoundScores)
        .where(eq(playerRoundScores.leagueId, leagueId))
        .groupBy(playerRoundScores.leagueId);

    return result?.avgPointsPerRound ?? 0;
}

/** Round with the highest single-player points scored from an auto-assigned draft in a league. */
export function getLeagueBestAutoAssignedRound(leagueId: number) {
    return getRoundExtreme({ leagueId, isAutoAssigned: true, direction: "best" });
}

/** Round with the lowest single-player points scored from an auto-assigned draft in a league. */
export function getLeagueWorstAutoAssignedRound(leagueId: number) {
    return getRoundExtreme({ leagueId, isAutoAssigned: true, direction: "worst" });
}

/** Top 3 most and least drafted drivers for every completed round in a league (excluding unpicked drivers for least drafted). */
export async function getLeagueRoundDraftExtremes(leagueId: number) {
    // 1. Fetch completed rounds in the league
    const completedRounds = await db
        .select({
            grandPrixId: grandsPrix.id,
            roundNumber: grandsPrix.roundNumber,
            eventName: grandsPrix.eventName,
        })
        .from(grandsPrix)
        .innerJoin(leagues, eq(leagues.seasonId, grandsPrix.seasonId))
        .where(
            and(
                eq(leagues.id, leagueId),
                eq(grandsPrix.isCompleted, true)
            )
        )
        .orderBy(asc(grandsPrix.roundNumber));

    if (completedRounds.length === 0) return [];

    // 2. Aggregate driver draft counts per round
    const driverCounts = await db
        .select({
            grandPrixId: drafts.grandPrixId,
            driverId: drivers.id,
            code: drivers.code,
            firstName: drivers.firstName,
            lastName: drivers.lastName,
            draftCount: sql<number>`count(*)::int`,
        })
        .from(drafts)
        .innerJoin(
            drivers,
            sql`${drivers.id} in (${drafts.driver1Id}, ${drafts.driver2Id}, ${drafts.driver3Id}, ${drafts.wildcardId})`
        )
        .where(eq(drafts.leagueId, leagueId))
        .groupBy(
            drafts.grandPrixId,
            drivers.id,
            drivers.code,
            drivers.firstName,
            drivers.lastName
        );

    // 3. Group drivers by round and slice the top/bottom 3
    return completedRounds.map((gp) => {
        const roundDrivers = driverCounts
            .filter((d) => d.grandPrixId === gp.grandPrixId)
            .sort((a, b) => b.draftCount - a.draftCount);

        const mostDrafted = roundDrivers.slice(0, 3);

        // Excludes unpicked drivers since roundDrivers only contains drivers with >0 picks
        const leastDrafted = [...roundDrivers]
            .reverse()
            .slice(0, 3);

        return {
            grandPrixId: gp.grandPrixId,
            roundNumber: gp.roundNumber,
            eventName: gp.eventName,
            mostDrafted,
            leastDrafted,
        };
    });
}

/** Player with the highest count of auto-assigned drafts in a specific league. */
export async function getPlayerWithMostAutoAssignedDrafts(leagueId: number) {
    const [result] = await db
        .select({
            playerId: drafts.playerId,
            username: players.username,
            autoAssignedCount: sql<number>`count(*)::int`,
        })
        .from(drafts)
        .innerJoin(players, eq(players.id, drafts.playerId))
        .where(
            and(
                eq(drafts.leagueId, leagueId),
                eq(drafts.isAutoAssigned, true)
            )
        )
        .groupBy(drafts.playerId, players.username)
        .orderBy(desc(sql`count(*)`))
        .limit(1);

    return result ?? null;
}

// ============================================================================
// 10. PLAYER STATISTICAL METRICS
// ============================================================================

/** Most drafted driver by a specific player (can filter by leagueId or check across all leagues). */
export async function getPlayerMostDraftedDriver(playerId: number, leagueId: number) {
    const whereCondition = leagueId
        ? and(eq(drafts.playerId, playerId), eq(drafts.leagueId, leagueId))
        : eq(drafts.playerId, playerId);

    const [result] = await db
        .select({
            driverId: drivers.id,
            code: drivers.code,
            firstName: drivers.firstName,
            lastName: drivers.lastName,
            draftCount: sql<number>`count(*)`,
        })
        .from(drafts)
        .innerJoin(
            drivers,
            sql`${drivers.id} in (${drafts.driver1Id}, ${drafts.driver2Id}, ${drafts.driver3Id}, ${drafts.wildcardId})`
        )
        .where(whereCondition)
        .groupBy(drivers.id, drivers.code, drivers.firstName, drivers.lastName)
        .orderBy(desc(sql`count(*)`))
        .limit(1);

    return result ?? null;
}

/** Most drafted constructor by a specific player (can filter by leagueId or check across all leagues). */
export async function getPlayerMostDraftedConstructor(playerId: number, leagueId: number) {
    const whereCondition = leagueId
        ? and(eq(drafts.playerId, playerId), eq(drafts.leagueId, leagueId))
        : eq(drafts.playerId, playerId);

    const [result] = await db
        .select({
            constructorId: constructors.id,
            shortName: constructors.shortName,
            fullName: constructors.fullName,
            draftCount: sql<number>`count(*)`,
        })
        .from(drafts)
        .innerJoin(constructors, eq(constructors.id, drafts.constructorId))
        .where(whereCondition)
        .groupBy(constructors.id, constructors.shortName, constructors.fullName)
        .orderBy(desc(sql`count(*)`))
        .limit(1);

    return result ?? null;
}

/** Highest cumulative points scored by a driver across all rounds in this player's lineup. */
export async function getPlayerHighestPointsScoringDriver(playerId: number, leagueId: number) {
    const result = await db.execute<DriverPointsRow>(sql`
        WITH ${driverRoundPointsCte(playerId, leagueId)}
        SELECT drv.id AS "driverId", drv.code, drv.first_name AS "firstName", drv.last_name AS "lastName",
               SUM(drp.points) AS "totalPointsContributed"
        FROM driver_round_points drp
        JOIN drivers drv ON drv.id = drp.driver_id
        WHERE drp.points IS NOT NULL
        GROUP BY drv.id, drv.code, drv.first_name, drv.last_name
        ORDER BY "totalPointsContributed" DESC
        LIMIT 1
    `);

    return result.rows[0] ?? null;
}

/** Lowest cumulative points scored by a driver across all rounds in this player's lineup. */
export async function getPlayerLowestPointsScoringDriver(playerId: number, leagueId: number) {
    const result = await db.execute<DriverPointsRow>(sql`
        WITH ${driverRoundPointsCte(playerId, leagueId)}
        SELECT drv.id AS "driverId", drv.code, drv.first_name AS "firstName", drv.last_name AS "lastName",
               SUM(drp.points) AS "totalPointsContributed"
        FROM driver_round_points drp
        JOIN drivers drv ON drv.id = drp.driver_id
        WHERE drp.points IS NOT NULL
        GROUP BY drv.id, drv.code, drv.first_name, drv.last_name
        ORDER BY "totalPointsContributed" ASC
        LIMIT 1
    `);

    return result.rows[0] ?? null;
}

/** Highest points scored by a driver in a single round in this player's lineup. */
export async function getPlayerHighestSingleRoundDriverScore(playerId: number, leagueId: number) {
    const result = await db.execute<DriverSingleRoundRow>(sql`
        WITH ${driverRoundPointsCte(playerId, leagueId)}
        SELECT drv.id AS "driverId", drv.code, drv.first_name AS "firstName", drv.last_name AS "lastName",
               gp.id AS "grandPrixId", gp.round_number AS "roundNumber", gp.event_name AS "eventName",
               drp.points AS "pointsScored"
        FROM driver_round_points drp
        JOIN drivers drv ON drv.id = drp.driver_id
        JOIN grands_prix gp ON gp.id = drp.grand_prix_id
        WHERE drp.points IS NOT NULL
        ORDER BY drp.points DESC
        LIMIT 1
    `);

    return result.rows[0] ?? null;
}

/** Lowest points scored by a driver in a single round in this player's lineup. */
export async function getPlayerLowestSingleRoundDriverScore(playerId: number, leagueId: number) {
    const result = await db.execute<DriverSingleRoundRow>(sql`
        WITH ${driverRoundPointsCte(playerId, leagueId)}
        SELECT drv.id AS "driverId", drv.code, drv.first_name AS "firstName", drv.last_name AS "lastName",
               gp.id AS "grandPrixId", gp.round_number AS "roundNumber", gp.event_name AS "eventName",
               drp.points AS "pointsScored"
        FROM driver_round_points drp
        JOIN drivers drv ON drv.id = drp.driver_id
        JOIN grands_prix gp ON gp.id = drp.grand_prix_id
        WHERE drp.points IS NOT NULL
        ORDER BY drp.points ASC
        LIMIT 1
    `);

    return result.rows[0] ?? null;
}

/** Highest single round score recorded by a player (can filter by leagueId or check across all leagues). */
export function getPlayerBestRound(playerId: number, leagueId: number) {
    return getRoundExtreme({ leagueId, playerId, isAutoAssigned: false, direction: "best" });
}

export function getPlayerWorstRound(playerId: number, leagueId: number) {
    return getRoundExtreme({ leagueId, playerId, isAutoAssigned: false, direction: "worst" });
}

export function getPlayerBestAutoAssignedRound(playerId: number, leagueId: number) {
    return getRoundExtreme({ leagueId, playerId, isAutoAssigned: true, direction: "best" });
}

export function getPlayerWorstAutoAssignedRound(playerId: number, leagueId: number) {
    return getRoundExtreme({ leagueId, playerId, isAutoAssigned: true, direction: "worst" });
}

/** Average points scored per round by a player (can filter by leagueId or average across all leagues). */
export async function getPlayerAveragePointsPerRound(playerId: number, leagueId?: number) {
    if (leagueId) {
        const stats = await db
            .select({ avgPointsPerRound: vPlayerLeagueStats.avgPointsPerRound })
            .from(vPlayerLeagueStats)
            .where(
                and(
                    eq(vPlayerLeagueStats.playerId, playerId),
                    eq(vPlayerLeagueStats.leagueId, leagueId)
                )
            );

        return stats[0]?.avgPointsPerRound ? Number(stats[0].avgPointsPerRound) : 0;
    }

    const [result] = await db
        .select({
            avgPoints: sql<number>`COALESCE(avg(${playerRoundScores.totalPoints}), 0)`,
        })
        .from(playerRoundScores)
        .where(eq(playerRoundScores.playerId, playerId));

    return result?.avgPoints ? Number(result.avgPoints) : 0;
}
