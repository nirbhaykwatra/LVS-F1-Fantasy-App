// League related functions

import { db } from "@/db";
import {leagues, playerLeagues} from "@/db/schema";
import {eq, and} from "drizzle-orm";

export async function addLeague(name: string, seasonId: number, createdByPlayerId: number, currentOwnerId: number, visibility: string){

    const slug = await getSlugFromLeagueName(name);
    const inviteCode = await generateLeagueInviteCode();

    try {
        const [newLeague] = await db.insert(leagues).values({
            name: name,
            seasonId: seasonId,
            createdByPlayerId: createdByPlayerId,
            inviteCode: inviteCode,
            slug: slug,
            currentOwnerId: currentOwnerId,
            visibility: visibility
        }).returning({ id: leagues.id });

        return { id: newLeague.id, name: name, inviteCode, slug, visibility }
    }
    catch (e) {
         console.error("Error creating league: " + e);
         return null;
    }
}

export async function addPlayerToLeague(playerId: number, leagueId: number, seasonId: number, teamName: string, teamMotto: string, role: string = "player"){
    try {
        const [existing] = await db
            .select()
            .from(playerLeagues)
            .where(and(eq(playerLeagues.playerId, playerId), eq(playerLeagues.leagueId, leagueId)))
            .limit(1);

        if (existing) {
            console.error("Player is already a member of this league");
            return null;
        }

        const [playerLeague] = await db.insert(playerLeagues).values({
            playerId: playerId,
            leagueId: leagueId,
            seasonId: seasonId,
            teamName: teamName,
            teamMotto: teamMotto,
            role: role
        }).returning({ playerId: playerLeagues.playerId, leagueId:  playerLeagues.leagueId });

        return { playerId: playerLeague.playerId, leagueId: playerLeague.leagueId };
    }
    catch (e) {
        console.error("Error adding player to league: " + e);
        return null;
    }
}

export async function addPlayerToLeagueByCode(inviteCode: string, playerId: number, seasonId: number, teamName: string, teamMotto: string, role: string = "player"){

    try {
        const [league] = await db.select().from(leagues).where(eq(leagues.inviteCode, inviteCode)).limit(1);
        if (!league) {
            console.error("League not found");
            return null;
        }

        const player = await addPlayerToLeague(playerId, league.id, seasonId, teamName, teamMotto, role);
        if (!player) {
            console.error("Error adding player to league");
            return null;
        }

        return player;
    }
    catch (e) {
        console.error("Error adding player to league: " + e);
        return null;
    }
}

export async function getLeagueByInviteCode(code: string){
    const [league] = await db.select().from(leagues).where(eq(leagues.inviteCode, code)).limit(1);
    if (!league) {
        console.error("League not found");
        return null;
    }

    return league;
}

export async function getLeagueBySlug(leagueSlug: string){
    const [league] = await db.select().from(leagues).where(eq(leagues.slug, leagueSlug)).limit(1);
    if (!league) {
        console.error("League not found");
        return null;
    }

    return league;
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

async function generateLeagueInviteCode(){
    return Math.random().toString(36).substring(2, 15);
}

async function getSlugFromLeagueName(name: string){
    return name.toLowerCase().replace(/\s+/g, '-');
}