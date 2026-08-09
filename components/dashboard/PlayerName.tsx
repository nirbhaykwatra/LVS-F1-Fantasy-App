import { getCurrentUser } from "@/lib/dal/user";
import {getPlayerLeaguesSummary, getPlayerTeamMotto} from "@/lib/dal/playerInfo";

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
};
