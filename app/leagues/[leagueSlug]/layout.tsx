import getDate from "@/components/common/Date";
import { Suspense } from "react";
import { Sidebar } from "@/components/dashboard/LeagueDashboardClientComponents";
import { AnimatedBackground } from "@/components/common/AnimatedBackground";
import { SignOutButton } from "@/components/common/UI";
import { PlayerNameNav } from "@/components/common/UIServer";
import { HeaderLogoButton } from "@/components/common/Header";
import { SidebarSkeleton } from "@/components/skeletons";

async function SidebarWithSlug({ params }: { params: Promise<{ leagueSlug: string }> }) {
    const { leagueSlug } = await params;
    return <Sidebar leagueSlug={leagueSlug} />;
}

export default async function LeagueDashboardLayout({ children, params }: { children: React.ReactNode; params: Promise<{ leagueSlug: string }>; }) {
    return (
        <div className="relative isolate flex h-dvh flex-col overflow-hidden bg-background font-sans">
            <AnimatedBackground />

            {/* Sticky header — never scrolls */}
            <header className="relative z-10 flex shrink-0 items-center justify-between px-6 py-5 sm:px-10 border-b border-black/10 dark:border-white/10 bg-background/50 backdrop-blur-md">
                <HeaderLogoButton />
                <nav className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-foreground">
                        <Suspense fallback={<div />}>
                            <PlayerNameNav />
                        </Suspense>
                    </span>
                    <SignOutButton />
                </nav>
            </header>

            {/* Content row — fills remaining height */}
            <div className="relative z-10 flex flex-1 min-h-0">

                {/* Sidebar — hidden on mobile, sticky on md+ */}
                <div className="hidden md:flex">
                    <Suspense fallback={<SidebarSkeleton />}>
                        <SidebarWithSlug params={params} />
                    </Suspense>
                </div>

                {/* Scrollable content + footer */}
                <div className="flex flex-1 flex-col min-h-0">
                    <main className="flex-1 overflow-y-auto px-6 py-12 sm:px-10">
                        <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full">
                            <Suspense fallback={<p />}>
                                {children}
                            </Suspense>
                        </div>
                    </main>
                    <footer className="hidden relative z-10 shrink-0 md:flex items-center justify-center px-6 py-6 text-xs text-foreground/50">
                        © {await getDate()} Nirbhay Kwatra. This application is not affiliated with the FIA, FOM, the Formula One brand or Liberty Media in any way.
                    </footer>
                </div>
            </div>

            {/* Mobile bottom nav — shown instead of sidebar on small screens */}
            <div className="md:hidden">
                <Suspense fallback={<div className="h-14 border-t border-black/10 dark:border-white/10 bg-background/80" />}>
                    <SidebarWithSlug params={params} />
                </Suspense>
            </div>
        </div>
    );
}