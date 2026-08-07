import SmallCard from "@/components/dashboard/SmallCard";
import { getCurrentUser } from "@/lib/dal/user";
import {getMostDraftedConstructorForPlayer, getPlayerLeaguesSummary, getPlayerTeamName} from "@/lib/dal/playerInfo";

export async function Summary({ searchParams }: { searchParams: Promise<{ leagueId?: string }> }) {
    const user = await getCurrentUser();
    if (!user) return null;
    const leagues = await getPlayerLeaguesSummary(user.id);
    const rawLeagueId = (await searchParams)?.leagueId;
    const leagueId = rawLeagueId
        ? Number(rawLeagueId)
        : leagues[0]?.leagueId; // default to the (only) league when nothing is selected

    const playerTeamName = await getPlayerTeamName(user.id, { leagueId });

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Card 1: Team Info */}
            <SmallCard label="Team Name" value={playerTeamName ?? "Not Set"} />

            {/* Card 2: Points */}
            <SmallCard label="Total Points" value={leagues.find((league) => league.leagueId === leagueId)?.currentPointsTotal.toString() ?? "N/A"} />

            {/* Card 3: Global Rank */}
            <SmallCard label="League Rank" value={leagues.find((league) => league.leagueId === leagueId)?.currentRank.toString() ?? "N/A"} />
        </div>
    );
}