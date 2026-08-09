import Link from "next/link";
import {PlayerLeaguesSummary} from "@/lib/dal/playerInfo";

export function LeagueStandingsList({ leagues }: { leagues: PlayerLeaguesSummary }) {
    const sorted = [...leagues].sort((a, b) => b.currentPointsTotal - a.currentPointsTotal);
    const maxPoints = Math.max(...sorted.map((l) => l.currentPointsTotal), 1);

    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-4 border-b border-black/10 px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-foreground/40 dark:border-white/10">
                <span className="w-10">Pos</span>
                <span className="flex-1">League</span>
                <span className="w-20 text-right">Points</span>
                <span className="w-5" />
            </div>

            <ul>
                {sorted.map((league, i) => {
                    const pct = Math.max((league.currentPointsTotal / maxPoints) * 100, 4);
                    return (
                        <li key={league.leagueId}>
                            <Link
                                href={`/leagues/${league.leagueId}/dashboard`}
                                className="group flex items-center gap-4 border-b border-black/5 px-5 py-4 transition hover:bg-brand/5 last:border-b-0 dark:border-white/5"
                            >
                <span className="w-10 font-mono text-xs font-bold text-brand">
                  P{i + 1}
                </span>

                                <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="truncate text-sm font-semibold text-foreground">
                    {league.leagueName}
                  </span>
                  <span className="h-1 w-full max-w-40 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                    <span
                        className="block h-full rounded-full bg-brand/70 transition-all"
                        style={{ width: `${pct}%` }}
                    />
                  </span>
                </span>

                                <span className="w-20 text-right font-mono text-sm font-bold tabular-nums text-foreground">
                  {league.currentPointsTotal.toLocaleString()}
                </span>

                                <span className="w-5 text-right text-foreground/30 transition group-hover:translate-x-0.5 group-hover:text-brand">
                  →
                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}