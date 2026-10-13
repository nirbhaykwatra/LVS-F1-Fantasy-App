import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AnimatedBackground } from "@/components/common/AnimatedBackground";
import { SignOutButton } from "@/components/common/UI";
import { PlayerNameNav } from "@/components/common/UIServer";
import { JoinLeagueForm, JoinLeagueTeamForm } from "@/components/forms/LeagueForms";
import { getCurrentUser } from "@/lib/dal/user";
import { HeaderLogoButton } from "@/components/common/Header";
import { JoinLeagueSkeleton } from "@/components/skeletons";

// Unwraps the async params promise and hands off the code string to the auth gate
async function JoinLeagueContent({ searchParams }: { searchParams: Promise<{ code: string }> }) {
    const { code } = await searchParams;
    return <JoinLeagueGate code={code} />;
}

// Auth check is dynamic (reads the session cookie/JWT), so it's isolated here
// and wrapped in Suspense below, rather than awaited directly in the page body.
async function JoinLeagueGate({ code }: { code: string }) {
    const user = await getCurrentUser();
    if (!user) redirect("/signin");

    if (code) {
        return <JoinLeagueTeamForm code={code} />;
    }
    else{
         return <JoinLeagueForm />;
    }
}

// The main page is now fully static, allowing it to render immediately as part of the instant static shell.
export default function JoinLeaguePage({ searchParams }: { searchParams: Promise<{ code: string }> }) {
    return (
        <div className="relative isolate flex min-h-screen flex-col bg-background font-sans">
            <AnimatedBackground />

            <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10 border-b border-black/10 dark:border-white/10 bg-background/50 backdrop-blur-md">
                <HeaderLogoButton />
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
                        href="/dashboard"
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
                        Give your team a name and a motto before you join the grid!
                    </p>
                </div>

                <div className="rounded-2xl border border-black/10 bg-white/80 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
                    {/* The suspense fallback wraps the dynamic params parsing and user check block */}
                    <Suspense fallback={<JoinLeagueSkeleton />}>
                        <JoinLeagueContent searchParams={searchParams} />
                    </Suspense>
                </div>
            </main>
        </div>
    );
}
