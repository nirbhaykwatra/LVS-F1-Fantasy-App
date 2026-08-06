import { getCurrentUser } from "@/lib/dal";
import {getPlayerLeaguesSummary, getPlayerTeamMotto} from "@/lib/dal/dashboard";

export async function PlayerName({ searchParams }: { searchParams: Promise<{ leagueId?: string }>}) {
    const user = await getCurrentUser();
    if (!user) return null;

    const leagues = await getPlayerLeaguesSummary(user.id);

    const rawLeagueId = (await searchParams)?.leagueId;
    const leagueId = rawLeagueId
        ? Number(rawLeagueId)
        : leagues[0]?.leagueId; // default to the (only) league when nothing is selected

    const playerMotto = await getPlayerTeamMotto(user.id, { leagueId })

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
};
