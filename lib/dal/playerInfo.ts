import { db } from "@/db";
import {
    vPlayerLeagueStats,
    playerRoundScores,
    grandsPrix,
    drafts,
    constructors,
    playerLeagues, players
} from "@/db/schema";
import { eq, and, desc, sql, asc } from "drizzle-orm";
import { GrandPrixOption } from "@/components/dashboard/GrandPrixSelector";

// ---------- breakdown_json shape ----------

export type PointsBreakdownEntry = {
    name: string;
    points: number;
    details: string;
};

export type PointsBreakdown = {
    total: number;
    driver1: PointsBreakdownEntry;
    driver2: PointsBreakdownEntry;
    driver3: PointsBreakdownEntry;
    wildcard: PointsBreakdownEntry;
    constructor: PointsBreakdownEntry;
};

// ---------- 1. Leagues summary (unchanged) ----------

export type PlayerLeaguesSummary = Array<{ leagueId: number, leagueName: string; currentPointsTotal: number; currentRank: number }>;

export async function getPlayerLeaguesSummary(playerId: number): Promise<PlayerLeaguesSummary> {
    const rows = await db
        .select({
            leagueId: vPlayerLeagueStats.leagueId,
            leagueName: vPlayerLeagueStats.leagueName,
            currentPointsTotal: vPlayerLeagueStats.totalPoints,
            currentRank: vPlayerLeagueStats.currentRank,
        })
        .from(vPlayerLeagueStats)
        .where(eq(vPlayerLeagueStats.playerId, playerId));

    const summary: PlayerLeaguesSummary = [];
    for (const row of rows) {
        if (row.leagueId === null) continue;
        summary.push({
            leagueId: row.leagueId ?? 0,
            leagueName: row.leagueName ?? "",
            currentPointsTotal: row.currentPointsTotal ?? 0,
            currentRank: row.currentRank ?? 0,
        });
    }
    return summary;
}

export type LeagueLeaderboardData = {leagueId: number, seasonId: number, playerData: Array<[playerId: number, username: string, teamName: string, points: number, rank: number]>};
export async function getLeagueLeaderboard(leagueId: number): Promise<LeagueLeaderboardData | null> {
    const rows = await db
        .select({
            playerId: vPlayerLeagueStats.playerId,
            seasonId: vPlayerLeagueStats.seasonId,
            totalPoints: vPlayerLeagueStats.totalPoints,
            currentRank: vPlayerLeagueStats.currentRank,
            username: vPlayerLeagueStats.username,
            teamName: vPlayerLeagueStats.teamName,
        })
        .from(vPlayerLeagueStats)
        .where(eq(vPlayerLeagueStats.leagueId, leagueId))
        .orderBy(asc(vPlayerLeagueStats.currentRank));

    if (rows.length === 0) {
        return null;
    }

    const seasonId = rows[0].seasonId;
    if (seasonId === null) {
        throw new Error(`getLeagueLeaderboard: seasonId null for leagueId ${leagueId}`);
    }

    const playerData = rows.map((row): [number, string, string, number, number] => {
        if (row.playerId === null || row.username === null || row.teamName === null || row.totalPoints === null || row.currentRank === null) {
            throw new Error(`getLeagueLeaderboard: unexpected null field for leagueId ${leagueId}`);
        }
        return [row.playerId, row.username, row.teamName, row.totalPoints, row.currentRank];
    });

    return { leagueId, seasonId, playerData };
}

// ---------- 2. Per-league, per-round detail, with full driver/constructor objects ----------

export type DriverSummary = {
    id: number;
    code: string;
    firstName: string;
    lastName: string;
    imageUrl: string | null;
    constructor: {
        shortName: string;
        colorHex: string;
    };
};

export type ConstructorSummary = {
    id: number;
    shortName: string;
    colorHex: string;
};

export type LeagueRoundData = Record<number,
    {
        totalPoints: number;
        grandPrixName: string;
        pointsBreakdown: PointsBreakdown;
        driver1: DriverSummary | null;
        driver2: DriverSummary | null;
        driver3: DriverSummary | null;
        bogey: DriverSummary | null;
        constructor: ConstructorSummary | null;
    }
    >;

export async function getPlayerLeagueSeasonDetail(playerId: number, leagueId: number): Promise<LeagueRoundData> {
    // Step 1: round scores + the raw pick IDs for that round (leftJoin — a round
    // may not have a draft yet, e.g. an upcoming race weekend).
    const rows = await db
        .select({
            roundNumber: grandsPrix.roundNumber,
            grandPrixName: grandsPrix.eventName,
            totalPoints: playerRoundScores.totalPoints,
            breakdownJson: playerRoundScores.breakdownJson,
            driver1Id: drafts.driver1Id,
            driver2Id: drafts.driver2Id,
            driver3Id: drafts.driver3Id,
            wildcardId: drafts.wildcardId,
            pickedConstructorId: drafts.constructorId,
        })
        .from(playerRoundScores)
        .innerJoin(grandsPrix, eq(grandsPrix.id, playerRoundScores.grandPrixId))
        .leftJoin(
            drafts,
            and(
                eq(drafts.grandPrixId, playerRoundScores.grandPrixId),
                eq(drafts.leagueId, playerRoundScores.leagueId),
                eq(drafts.playerId, playerRoundScores.playerId)
            )
        )
        .where(
            and(
                eq(playerRoundScores.playerId, playerId),
                eq(playerRoundScores.leagueId, leagueId)
            )
        );

    // Step 2: collect the unique driver/constructor IDs referenced across all
    // rounds, so we fetch each one once no matter how many rounds there are.
    const driverIds = new Set<number>();
    const constructorIds = new Set<number>();
    for (const r of rows) {
        if (r.driver1Id) driverIds.add(r.driver1Id);
        if (r.driver2Id) driverIds.add(r.driver2Id);
        if (r.driver3Id) driverIds.add(r.driver3Id);
        if (r.wildcardId) driverIds.add(r.wildcardId);
        if (r.pickedConstructorId) constructorIds.add(r.pickedConstructorId);
    }

    const [driverRows, constructorRows] = await Promise.all([
        driverIds.size
            ? db.query.drivers.findMany({
                where: (drivers, { inArray }) => inArray(drivers.id, [...driverIds]),
                with: { constructor: true },
            })
            : Promise.resolve([]),
        constructorIds.size
            ? db.query.constructors.findMany({
                where: (constructors, { inArray }) =>
                    inArray(constructors.id, [...constructorIds]),
            })
            : Promise.resolve([]),
    ]);

    const driverMap = new Map<number, DriverSummary>(
        driverRows.map((d) => [
            d.id,
            {
                id: d.id,
                code: d.code,
                firstName: d.firstName,
                lastName: d.lastName,
                imageUrl: d.driverImageUrl,
                constructor: {
                    shortName: d.constructor.shortName,
                    colorHex: d.constructor.colorHex,
                },
            },
        ])
    );

    const constructorMap = new Map<number, ConstructorSummary>(
        constructorRows.map((c) => [
            c.id,
            { id: c.id, shortName: c.shortName, colorHex: c.colorHex },
        ])
    );

    // Step 3: assemble the keyed result, joining rows against the two maps.
    const detail: LeagueRoundData = {};
    for (const r of rows) {
        if (r.roundNumber === null) continue;
        detail[r.roundNumber] = {
            totalPoints: r.totalPoints ?? 0,
            grandPrixName: r.grandPrixName,
            pointsBreakdown: r.breakdownJson as PointsBreakdown,
            driver1: r.driver1Id ? driverMap.get(r.driver1Id) ?? null : null,
            driver2: r.driver2Id ? driverMap.get(r.driver2Id) ?? null : null,
            driver3: r.driver3Id ? driverMap.get(r.driver3Id) ?? null : null,
            bogey: r.wildcardId ? driverMap.get(r.wildcardId) ?? null : null,
            constructor: r.pickedConstructorId
                ? constructorMap.get(r.pickedConstructorId) ?? null
                : null,
        };
    }
    return detail;
}

export async function getMostRecentGrandPrix() {
    const completedGrandsPrix = await db
        .select({ roundNumber: grandsPrix.roundNumber, name: grandsPrix.eventName, date: grandsPrix.raceDateUtc })
        .from(grandsPrix)
        .where(eq(grandsPrix.isCompleted, true))
        .orderBy(desc(grandsPrix.roundNumber))
        .limit(1);

    return completedGrandsPrix[0];
}

export async function getGrandPrixOptions(): Promise<GrandPrixOption[]> {
    const allGrandsPrix = await db
        .select()
        .from(grandsPrix)
        .where(eq(grandsPrix.isCompleted, true))
        .orderBy(desc(grandsPrix.roundNumber));

    const grandPrixOptions: GrandPrixOption[] = allGrandsPrix.map((r) => ({
        roundNumber: r.roundNumber,
        name: r.eventName,
    }));

    return grandPrixOptions;
}

export async function getPlayerFromId(playerId: number) {
    const [player] = await db
        .select()
        .from(players)
        .where(eq(players.id, playerId))
        .limit(1);

    return player ?? null;
}

export async function getPlayerTeamName(playerId: number, leagueId: number): Promise<string | null> {
    const conditions = [eq(playerLeagues.playerId, playerId), eq(playerLeagues.leagueId, leagueId)];

    const playerLeague = await db.select()
        .from(playerLeagues)
        .where(
            and(...conditions)
        )
        .limit(1);
    return playerLeague[0]?.teamName ?? null;
}

export async function getPlayerTeamMotto(playerId: number, leagueId: number): Promise<string | null> {
    const conditions = [eq(playerLeagues.playerId, playerId), eq(playerLeagues.leagueId, leagueId)];

    const playerLeague = await db.select()
        .from(playerLeagues)
        .where(
            and(...conditions)
        )
        .limit(1);
    return playerLeague[0]?.teamMotto ?? null;
}