import SmallCard from "@/components/dashboard/SmallCard";
import { getCurrentUser } from "@/lib/dal";
import { getPlayerLeaguesSummary } from "@/lib/dal/dashboard";

export async function DashboardSummary() {
    const user = await getCurrentUser();
    if (!user) return null;
    const league = await getPlayerLeaguesSummary(user.id);
    if (!league) return null;

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Card 1: Team Info */}
            <SmallCard label="Favorite Team" value="Red Bull Racing" />

            {/* Card 2: Points */}
            <SmallCard label="Total Points" value={league[0].currentPointsTotal.toString()} />

            {/* Card 3: Global Rank */}
            <SmallCard label="League Rank" value={league[0].currentRank.toString()} />
        </div>
    );
}