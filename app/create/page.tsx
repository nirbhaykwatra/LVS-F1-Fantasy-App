import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AnimatedBackground } from "@/components/common/AnimatedBackground";
import { SignOutButton } from "@/components/common/UI";
import { PlayerNameNav } from "@/components/common/UIServer";
import { CreateLeagueForm } from "@/components/forms/LeagueForms";
import { CreateLeagueSkeleton } from "@/components/skeletons";
import { getCurrentUser } from "@/lib/dal/user";
import { HeaderLogoButton } from "@/components/common/Header";

async function CreateLeagueGate() {
    const user = await getCurrentUser();
    if (!user) redirect("/signin");

    return <CreateLeagueForm />;
}

export default function CreateLeaguePage() {
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
                        ← Back to dashboard
                    </Link>
                    <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                        Create a League
                    </h1>
                    <p className="max-w-md text-sm text-foreground/60">
                        Set a name and choose who can see it. You can change this later from the
                        league&apos;s admin dashboard.
                    </p>
                </div>

                <div className="rounded-2xl border border-black/10 bg-white/80 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
                    <Suspense fallback={<CreateLeagueSkeleton />}>
                        <CreateLeagueGate />
                    </Suspense>
                </div>
            </main>
        </div>
    );
}