"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PlayerLeaguesSummary } from "@/lib/dal/dashboard";

export function LeagueSelector({ options, selected }: { options: PlayerLeaguesSummary; selected: { leagueId: number, leagueName: string; currentPointsTotal: number; currentRank: number } }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

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
        const params = new URLSearchParams(searchParams.toString());
        params.set("league", String(leagueId));
        router.push(`?${params.toString()}`, { scroll: false });
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