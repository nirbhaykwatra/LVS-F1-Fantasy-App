'use server'

import  { redirect } from "next/navigation";
import { ActionResponse } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/dal/user";
import { addLeague, addPlayerToLeagueByCode, getLeagueByInviteCode, addPlayerToLeague, getLeagueById } from "@/lib/dal/leagues";
import { getCurrentSeason } from "@/lib/dal/stats";

export async function createLeague(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse | null> {
    const user = await getCurrentUser();
    if (!user) return {success: false, message: "You need to sign in first.", error: "You need to sign in first."};

    const name = String(formData.get("name") ?? "").trim();
    if (!name) return {success: false, message: "You need to sign in first.", error: "Give your league a name."};
    if (name.length > 40) return {
        success: false,
        message: "Keep the name under 40 characters.",
        error: "Keep the name under 40 characters."
    };

    const currentSeason = await getCurrentSeason();

    const visibility = formData.get("visibility") === "public" ? "public" : "private";

    const league = await addLeague(name, currentSeason.id, user.id, user.id, visibility);

    if (!league) return {
        success: false,
        message: "Could not create league!",
        error: "Could not create league!"
    }

    redirect(`/leagues/${league.slug}/setup`);
}

export async function setupOwnerTeam(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse | null> {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: "You need to sign in first.", error: "You need to sign in first." };

    const season = await getCurrentSeason();
    if (!season) return { success: false, message: "No active season.", error: "No active season." };

    const inviteCode = String(formData.get("inviteCode"));
    if (!inviteCode) return { success: false, message: "Invalid league.", error: "Invalid league." };

    // Server-side ownership check — the user must be the one who created this league
    const league = await getLeagueByInviteCode(inviteCode);
    if (!league || league.currentOwnerId !== user.id) {
        return { success: false, message: "Not authorised.", error: "Not authorised." };
    }

    const teamName = String(formData.get("teamName") ?? "").trim();
    const teamMotto = String(formData.get("teamMotto") ?? "").trim();

    if (!teamName) return { success: false, message: "Give your team a name.", error: "Give your team a name." };
    if (teamName.length > 30) return { success: false, message: "Keep the team name under 30 characters.", error: "Keep the team name under 30 characters." };
    if (!teamMotto) return { success: false, message: "Give your team a motto.", error: "Give your team a motto." };
    if (teamMotto.length > 80) return { success: false, message: "Keep the motto under 80 characters.", error: "Keep the motto under 80 characters." };

    const membership = await addPlayerToLeague(user.id, league.id, season.id, teamName, teamMotto, "owner");
    if (!membership) return { success: false, message: "Could not set up your team.", error: "Could not set up your team." };

    redirect(`/leagues/${league.slug}/dashboard`);
}

export async function redirectJoinToCreateTeam(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse | null> {
    const code = String(formData.get("inviteCode") ?? "").trim();
    const league = await getLeagueByInviteCode(code);
    if (!league) return {
        success: false,
        message: "Could not find league!",
        error: "Could not find league!"
    }

    redirect(`/join?code=${league.inviteCode}`);
}

export async function joinLeague(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse | null> {

    const user = await getCurrentUser();
    if (!user) return { success: false, message: "You need to sign in first.", error: "You need to sign in first." };

    const season = await getCurrentSeason();
    if (!season) return { success: false, message: "No season is currently active.", error: "No season is currently active." };

    const league =  await getLeagueByInviteCode(String(formData.get("inviteCode") ?? "").trim());
    if (!league) return { success: false, message: "That code didn't match a league.", error: "That code didn't match a league." };

    const code = String(formData.get("inviteCode") ?? "").trim();
    const teamName = String(formData.get("teamName") ?? "").trim();
    const teamMotto = String(formData.get("teamMotto") ?? "").trim();

    if (!teamName) return { success: false, message: "Give your team a name.", error: "Give your team a name." };
    if (teamName.length > 30) return { success: false, message: "Keep the team name under 30 characters.", error: "Keep the team name under 30 characters." };
    if (!teamMotto) return { success: false, message: "Give your team a motto.", error: "Give your team a motto." };
    if (teamMotto.length > 80) return { success: false, message: "Keep the motto under 80 characters.", error: "Keep the motto under 80 characters." };

    const membership = await addPlayerToLeagueByCode(code, user.id, season.id, teamName, teamMotto, "player").catch(() => null);

    if (!membership) return { success: false, message: "That code didn't match a league.", error: "That code didn't match a league." };

    redirect(`/leagues/${league.slug}/dashboard`);
}