import { getPlayerLeaguesSummary} from "@/lib/dal/dashboard";
import { getCurrentUser } from "@/lib/dal";

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
                                    <td>{league.leagueName}</td>
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