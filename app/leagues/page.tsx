import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AnimatedBackground } from "@/components/common/AnimatedBackground";
import SignOutButton from "@/components/dashboard/SignOutButton";
import { PlayerNameNav } from "@/components/dashboard/PlayerNameNav";
import { ButtonRounded, ButtonPill } from "@/components/common/Buttons";
import { LeagueStandingsList } from "@/components/leagues/LeagueStandingsList";
import { JoinLeagueForm, JoinLeagueState } from "@/components/leagues/JoinLeagueForm";
import { getCurrentUser } from "@/lib/dal/user";
import { getPlayerLeaguesSummary } from "@/lib/dal/playerInfo";
// NOTE: adjust this import to wherever your invite-code lookup actually lives —
// I assumed a DAL function with this name/shape since I don't have your league DAL.
// import { joinLeagueByInviteCode } from "@/lib/dal/league";

async function joinLeagueAction(
    _prevState: JoinLeagueState,
    formData: FormData
): Promise<JoinLeagueState> {
    "use server";

    const user = await getCurrentUser();
    if (!user) return { error: "You need to sign in first." };

    const code = String(formData.get("inviteCode") ?? "").trim();
    if (!code) return { error: "Enter an invite code." };

    // const joined = await joinLeagueByInviteCode(user.id, code).catch(() => null);
    // if (!joined) return { error: "That code didn't match a league." };

    redirect("/leagues");
}

// All auth/data access lives in here, so this is the only part of the tree
// that's dynamic — the header shell and page frame around it can still
// prerender, and Suspense streams this in once the JWT/DB calls resolve.
async function LeaguesContent() {
    const user = await getCurrentUser();
    if (!user) return null;

    const leagues = await getPlayerLeaguesSummary(user.id);
    const hasLeagues = leagues.length > 0;

    return (
        <>
            <div className="flex flex-col gap-2">
                <span className="w-fit rounded-full bg-brand/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
                    Grid
                </span>
                <div className="flex flex-row w-full justify-between items-center">
                    <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                        {hasLeagues ? "Your Leagues" : "You're not in a league yet"}
                    </h1>
                    {hasLeagues ? <div className="py-6">
                        <ButtonPill label="Create a League" href="/leagues/create" />
                    </div> :
                        <></>
                    }
                </div>

                {!hasLeagues && (
                    <p className="max-w-md text-sm text-foreground/60">
                        Start your own championship, or join a friend&apos;s with an invite code.
                    </p>
                )}
            </div>

            {hasLeagues ? (
                <LeagueStandingsList leagues={leagues} />
            ) : (
                <div className="flex justify-center py-6">
                    <ButtonRounded label="Create a League" href="/leagues/create" />
                </div>
            )}

            <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white/80 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-foreground/70">
                            Join a League
                        </h2>
                        <p className="text-xs text-foreground/50">
                            Got an invite code from a friend? Enter it below.
                        </p>
                    </div>
                </div>
                <JoinLeagueForm action={joinLeagueAction} />
            </div>
        </>
    );
}

function LeaguesSkeleton() {
    return (
        <div className="flex animate-pulse flex-col gap-8">
            <div className="flex flex-col gap-2">
                <span className="h-5 w-20 rounded-full bg-black/5 dark:bg-white/10" />
                <span className="h-8 w-56 rounded-lg bg-black/5 dark:bg-white/10" />
            </div>
            <div className="h-40 rounded-2xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5" />
            <div className="h-32 rounded-2xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5" />
        </div>
    );
}

export default function LeaguesPage() {
    return (
        <div className="relative isolate flex min-h-screen flex-col bg-background font-sans">
            <AnimatedBackground />

            <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10 border-b border-black/10 dark:border-white/10 bg-background/50 backdrop-blur-md">
                <Link
                    href="/"
                    className="flex items-center gap-2 font-mono text-sm font-bold tracking-widest text-foreground"
                >
                    <span className="h-2.5 w-2.5 rounded-full bg-brand" />
                    LVS F1 FANTASY
                </Link>
                <nav className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-foreground">
                    <Suspense fallback={<div></div>}>
                        <PlayerNameNav />
                    </Suspense>
                  </span>
                    <SignOutButton />
                </nav>
            </header>

            <main className="relative z-10 flex flex-1 flex-col gap-8 px-6 py-12 sm:px-10 max-w-3xl mx-auto w-full">
                <Suspense fallback={<LeaguesSkeleton />}>
                    <LeaguesContent />
                </Suspense>
            </main>
        </div>
    );
}