import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AnimatedBackground } from "@/components/common/AnimatedBackground";
import SignOutButton from "@/components/dashboard/SignOutButton";
import { PlayerNameNav } from "@/components/dashboard/PlayerNameNav";
import { JoinLeagueTeamForm, JoinLeagueTeamState } from "@/components/leagues/CompleteLeagueJoinForm";
import { getCurrentUser } from "@/lib/dal/user";
// NOTE: adjust this import/call to match your actual league DAL —
// I assumed a function with this name/shape since I don't have your league DAL.
import { joinLeagueByInviteCode } from "@/lib/dal";

async function joinLeagueAction(
    _prevState: JoinLeagueTeamState,
    formData: FormData
): Promise<JoinLeagueTeamState> {
    "use server";

    const user = await getCurrentUser();
    if (!user) return { error: "You need to sign in first." };

    const code = String(formData.get("code") ?? "").trim();
    const teamName = String(formData.get("teamName") ?? "").trim();
    const teamMotto = String(formData.get("teamMotto") ?? "").trim();

    if (!code) return { error: "Missing invite code — go back and re-enter it." };
    if (!teamName) return { error: "Give your team a name." };
    if (teamName.length > 30) return { error: "Keep the team name under 30 characters." };
    if (!teamMotto) return { error: "Give your team a motto." };
    if (teamMotto.length > 80) return { error: "Keep the motto under 80 characters." };

    const membership = await joinLeagueByInviteCode(user.id, code, {
        teamName,
        teamMotto,
    }).catch(() => null);

    if (!membership) return { error: "That code didn't match a league." };

    redirect(`/leagues/${membership.leagueId}/dashboard`);
}

// Unwraps the async params promise and hands off the code string to the auth gate
async function JoinLeagueContent({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params;
    return <JoinLeagueGate code={code} />;
}

// Auth check is dynamic (reads the session cookie/JWT), so it's isolated here
// and wrapped in Suspense below, rather than awaited directly in the page body.
async function JoinLeagueGate({ code }: { code: string }) {
    const user = await getCurrentUser();
    if (!user) redirect("/signin");

    return <JoinLeagueTeamForm code={code} action={joinLeagueAction} />;
}

function JoinLeagueSkeleton() {
    return (
        <div className="flex animate-pulse flex-col gap-8">
            <div className="h-12 rounded-xl bg-black/5 dark:bg-white/10" />
            <div className="h-12 rounded-xl bg-black/5 dark:bg-white/10" />
            <div className="h-11 w-40 rounded-full bg-black/5 dark:bg-white/10" />
        </div>
    );
}

// The main page is now fully static, allowing it to render immediately as part of the instant static shell.
export default function JoinLeaguePage({
                                           params,
                                       }: {
    params: Promise<{ code: string }>;
}) {
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

            <main className="relative z-10 flex flex-1 flex-col gap-8 px-6 py-12 sm:px-10 max-w-xl mx-auto w-full">
                <div className="flex flex-col gap-2">
                    <Link
                        href="/leagues"
                        className="w-fit text-xs font-semibold text-foreground/50 transition hover:text-brand"
                    >
                        ← Back to leagues
                    </Link>
                    <span className="w-fit rounded-full bg-brand/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
                        Join League
                    </span>
                    <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                        Set Up Your Team
                    </h1>
                    <p className="max-w-md text-sm text-foreground/60">
                        Your invite code checked out. Give your team a name and a motto before
                        you take the grid.
                    </p>
                </div>

                <div className="rounded-2xl border border-black/10 bg-white/80 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
                    {/* The suspense fallback wraps the dynamic params parsing and user check block */}
                    <Suspense fallback={<JoinLeagueSkeleton />}>
                        <JoinLeagueContent params={params} />
                    </Suspense>
                </div>
            </main>
        </div>
    );
}
