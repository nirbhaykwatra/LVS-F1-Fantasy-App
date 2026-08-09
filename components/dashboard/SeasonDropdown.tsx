import {getCurrentUser} from "@/lib/dal/user";
import {LeagueSelector} from "@/components/dashboard/LeagueSelector";
import {getPlayerLeaguesSummary} from "@/lib/dal/playerInfo";

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