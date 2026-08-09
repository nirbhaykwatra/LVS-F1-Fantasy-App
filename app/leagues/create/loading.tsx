import {AnimatedBackground} from "@/components/common/AnimatedBackground";
import SignOutButton from "@/components/dashboard/SignOutButton";
import Link from "next/link";
import {ButtonRounded} from "@/components/common/Buttons";

export default function CreateLeaguePageLoading() {
    return (
        <div className="relative isolate flex min-h-screen flex-col bg-background font-sans">
            <AnimatedBackground />

            <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10 border-b border-black/10 dark:border-white/10 bg-background/50 backdrop-blur-md">
                <Link href="/" className="flex items-center gap-2 font-mono text-sm font-bold tracking-widest text-foreground">
                    <span className="h-2.5 w-2.5 rounded-full bg-brand" />
                    LVS F1 FANTASY
                </Link>
                <nav className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-foreground">
                  </span>
                    <SignOutButton />
                </nav>
            </header>

            <main className="relative z-10 flex flex-1 flex-col gap-8 px-6 py-12 sm:px-10 max-w-5xl mx-auto w-full">
                {/* Welcome Section */}
                <ButtonRounded label="Create a new league" href="/" />
            </main>
        </div>
    )
}