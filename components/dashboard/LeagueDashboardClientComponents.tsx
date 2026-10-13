'use client';

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";
import { PlayerLeaguesSummary } from "@/lib/dal/playerInfo";

export type GrandPrixOption = {
    roundNumber: number;
    name: string;
};

export function LeagueSelector({ options, selected }: { options: PlayerLeaguesSummary; selected: { leagueId: number, leagueName: string; currentPointsTotal: number; currentRank: number } }) {
    "use client";
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
        redirect(`/leagues/${params.get("league")}/dashboard`);
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