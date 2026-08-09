import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AnimatedBackground } from "@/components/common/AnimatedBackground";
import SignOutButton from "@/components/dashboard/SignOutButton";
import { PlayerNameNav } from "@/components/dashboard/PlayerNameNav";
import { CreateLeagueForm, CreateLeagueState } from "@/components/leagues/CreateLeagueForm";
import { getCurrentUser } from "@/lib/dal/user";
// NOTE: adjust this import/call to match your actual league-creation DAL —
// I assumed a function with this name/shape since I don't have your league DAL.
// import { createLeague } from "@/lib/dal/league";

async function createLeagueAction(
    _prevState: CreateLeagueState,
    formData: FormData
): Promise<CreateLeagueState> {
    "use server";

    const user = await getCurrentUser();
    if (!user) return { error: "You need to sign in first." };

    const name = String(formData.get("name") ?? "").trim();
    if (!name) return { error: "Give your league a name." };
    if (name.length > 40) return { error: "Keep the name under 40 characters." };

    const visibility = formData.get("visibility") === "public" ? "public" : "private";

    // const league = await createLeague({
    //     name,
    //     isPublic: visibility === "public",
    //     ownerId: user.id,
    // }).catch(() => null);
    //
    // if (!league) return { error: "Something went wrong creating your league. Try again." };
    //
    redirect(`/leagues/dashboard`);
}

// Auth check is dynamic (reads the session cookie/JWT), so it's isolated here
// and wrapped in Suspense below — same pattern as the leagues list page —
// rather than awaited directly in the page body.
async function CreateLeagueGate() {
    const user = await getCurrentUser();
    if (!user) redirect("/signin");

    return <CreateLeagueForm action={createLeagueAction} />;
}

function CreateLeagueSkeleton() {
    return (
        <div className="flex animate-pulse flex-col gap-8">
            <div className="h-12 rounded-xl bg-black/5 dark:bg-white/10" />
            <div className="h-24 rounded-xl bg-black/5 dark:bg-white/10" />
            <div className="h-11 w-40 rounded-full bg-black/5 dark:bg-white/10" />
        </div>
    );
}

export default function CreateLeaguePage() {
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