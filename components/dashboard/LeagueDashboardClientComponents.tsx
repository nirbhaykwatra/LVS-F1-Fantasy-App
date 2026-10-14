'use client';

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { redirect, useRouter, useSearchParams, usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { PlayerLeaguesSummary } from "@/lib/dal/playerInfo";

export type GrandPrixOption = {
    roundNumber: number;
    name: string;
};

export function LeagueSelector({ options, selected }: { options: PlayerLeaguesSummary; selected: { leagueId: number, leagueName: string; currentPointsTotal: number; currentRank: number } }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleSelect(leagueId: number) {
        setIsOpen(false);
        if (leagueId === selected.leagueId) return;
        const league = options.find((o) => o.leagueId === leagueId);
        if (!league) return;
        const newPath = pathname.replace(/\/leagues\/[^/]+/, `/leagues/${league.slug}`);
        redirect(newPath);
    }

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                className="flex flex-row items-center gap-2 rounded-[1.5rem] border border-transparent px-2 py-1 -mx-2 -my-1 px-5 py-5 dark:border-white/10 dark:bg-white/5 backdrop-blur-sm"
            >
                <h2 className="text-lg font-bold text-foreground">
                    {selected.leagueName}
                </h2>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`h-4 w-4 shrink-0 text-foreground/60 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>

            {isOpen && (
                <div
                    role="listbox"
                    className="absolute left-0 top-full z-10 mt-2 max-h-72 w-72 overflow-y-auto rounded-2xl border border-black/10 bg-white/95 p-2 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/95"
                >
                    {options.map((option) => (
                        <button
                            key={option.leagueId}
                            type="button"
                            role="option"
                            aria-selected={option.leagueId === selected.leagueId}
                            onClick={() => handleSelect(option.leagueId)}
                            className={`block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${
                                option.leagueId === selected.leagueId
                                    ? "text-brand"
                                    : "text-foreground"
                            }`}
                        >
                            {option.leagueName}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export function GrandPrixSelector({ options, selected }: { options: GrandPrixOption[]; selected: GrandPrixOption; }) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const searchParams = useSearchParams();

    // Portals need a client-mounted document.body target
    useEffect(() => {
        setMounted(true);
    }, []);

    // Click outside now needs to check both the trigger AND the portaled menu
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            const clickedTrigger = containerRef.current?.contains(target);
            const clickedMenu = dropdownRef.current?.contains(target);
            if (!clickedTrigger && !clickedMenu) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Compute the menu's screen position from the button, since it's no
    // longer a DOM descendant of the button once portaled
    useLayoutEffect(() => {
        if (!isOpen) return;

        function updatePosition() {
            if (!buttonRef.current) return;
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY + 8,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
        }

        updatePosition();
        window.addEventListener("scroll", updatePosition, true);
        window.addEventListener("resize", updatePosition);
        return () => {
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
        };
    }, [isOpen]);

    function handleSelect(roundNumber: number) {
        setIsOpen(false);
        if (roundNumber === selected.roundNumber) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set("round", String(roundNumber));
        router.push(`?${params.toString()}`, { scroll: false });
    }

    return (
        <div className="relative" ref={containerRef}>
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                className="flex flex-row items-center gap-2 rounded-2xl sm:rounded-full border border-transparent px-5 py-2 -mx-2 -my-1 dark:border-white/10 dark:bg-white/5"
            >
                <h2 className="text-lg font-bold text-foreground">
                    Round {selected.roundNumber} - {selected.name}
                </h2>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`h-4 w-4 shrink-0 text-foreground/60 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>

            {mounted && isOpen && options.length >= 1 && createPortal(
                <div
                    ref={dropdownRef}
                    role="listbox"
                    style={{
                        position: "fixed",
                        top: position.top,
                        left: position.left,
                        minWidth: position.width,
                    }}
                    className="max-h-72 w-72 overflow-y-auto z-[9999] custom-scrollbar rounded-2xl border border-black/10 bg-white/95 p-2 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/95"
                >
                    {options.map((option) => (
                        <button
                            key={option.roundNumber}
                            type="button"
                            role="option"
                            aria-selected={option.roundNumber === selected.roundNumber}
                            onClick={() => handleSelect(option.roundNumber)}
                            className={`block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${
                                option.roundNumber === selected.roundNumber
                                    ? "text-brand"
                                    : "text-foreground"
                            }`}
                        >
                            Round {option.roundNumber} - {option.name}
                        </button>
                    ))}
                </div>,
                document.body
            )}
        </div>
    );
}

const NAV_ITEMS = [
    { label: "Overview",             href: (slug: string) => `/leagues/${slug}/dashboard`,           icon: "📖" },
    { label: "Points Table",         href: (slug: string) => `/leagues/${slug}/points`,              icon: "🥇" },
    { label: "Draft",                href: (slug: string) => `/leagues/${slug}/draft`,               icon: "✒️" },
    { label: "Counterpick",          href: (slug: string) => `/leagues/${slug}/counterpick`,         icon: "🎯" },
    { label: "Race Report",          href: (slug: string) => `/leagues/${slug}/race-report`,         icon: "🏁" },
    { label: "Player Profile",       href: (slug: string) => `/leagues/${slug}/player-profile`,      icon: "📊" },
    { label: "Driver Profile",       href: (slug: string) => `/leagues/${slug}/driver-profile`,      icon: "🏎️" },
    { label: "Constructor Profile",  href: (slug: string) => `/leagues/${slug}/constructor-profile`, icon: "🛠️" },
];

export function Sidebar({ leagueSlug }: { leagueSlug: string }) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    const navLinks = NAV_ITEMS.map(({ label, href, icon }) => {
        const to = href(leagueSlug);
        const isActive = pathname === to;
        return { label, to, icon, isActive };
    });

    return (
        <>
            {/* ── Desktop sidebar (md+) ── */}
            <aside
                className={`
                    hidden md:flex flex-col gap-2 border-r border-black/10 dark:border-white/10
                    bg-background/50 backdrop-blur-md transition-all duration-300 py-3
                    overflow-y-auto
                    ${collapsed ? "w-28" : "w-56"}
                `}
            >
                <nav className="flex flex-col gap-1 px-2">
                    {navLinks.map(({ label, to, icon, isActive }) => (
                        <Link
                            key={label}
                            href={to}
                            className={`
                                flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-all
                                ${isActive ? "bg-brand/10 text-brand" : "text-foreground/70 hover:bg-black/5 dark:hover:bg-white/5"}
                                ${collapsed ? "justify-center py-4" : "gap-3 px-3 py-4"}
                            `}
                        >
                            <span className="shrink-0 text-3xl">{icon}</span>
                            {!collapsed && <span className="truncate">{label}</span>}
                        </Link>
                    ))}
                </nav>
                <button
                    onClick={() => setCollapsed(c => !c)}
                    className="self-center mt-auto m-3 rounded-full p-1.5 text-foreground/60 hover:bg-black/10 dark:hover:bg-white/10 transition"
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <svg width="auto" height="24" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                        <line x1="2" y1="4" x2="16" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="origin-center transition-all duration-300" style={{ transform: !collapsed ? "translate(0px, 5px) rotate(45deg)" : "translate(0, 0) rotate(0deg)", transformOrigin: "9px 4px" }} />
                        <line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="transition-all duration-300" style={{ opacity: !collapsed ? 0 : 1 }} />
                        <line x1="2" y1="14" x2="16" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="origin-center transition-all duration-300" style={{ transform: !collapsed ? "translate(0px, -5px) rotate(-45deg)" : "translate(0, 0) rotate(0deg)", transformOrigin: "9px 14px" }} />
                    </svg>
                </button>
            </aside>

            {/* ── Mobile bottom nav (< md) ── */}
            <nav className="md:hidden flex items-center justify-around border-t border-black/10 bg-background/80 backdrop-blur-md overflow-x-auto">
                {navLinks.map(({ label, to, icon, isActive }) => (
                    <Link
                        key={label}
                        href={to}
                        className={`
                            flex flex-col items-center gap-0.5 px-3 py-2 text-xs font-semibold transition shrink-0
                            ${isActive ? "text-brand" : "text-foreground/60 hover:text-foreground"}
                        `}
                    >
                        <span className="text-2xl">{icon}</span>
                        <span className="text-[10px]">{label}</span>
                    </Link>
                ))}
            </nav>
        </>
    );
}