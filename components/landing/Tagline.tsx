'use client';

import { useEffect, useRef, useState } from "react";

const FADE_DURATION = 300; // ms, must match the Tailwind `duration-300` class below
const CYCLE_INTERVAL = 5000; // ms between tagline changes

function pickRandomTagline(taglines: string[], exclude?: string) {
    if (taglines.length <= 1) return taglines[0];
    let next: string;
    do {
        next = taglines[Math.floor(Math.random() * taglines.length)];
    } while (next === exclude);
    return next;
}

export function Tagline({ taglines }: { taglines: string[] }) {
    const [tagline, setTagline] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);
    const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => {
        setTagline(pickRandomTagline(taglines));
        setVisible(true);
    }, [taglines]);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisible(false);

            fadeTimeoutRef.current = setTimeout(() => {
                setTagline((current) => pickRandomTagline(taglines, current ?? undefined));
                setVisible(true);
            }, FADE_DURATION);
        }, CYCLE_INTERVAL);

        return () => {
            clearInterval(interval);
            clearTimeout(fadeTimeoutRef.current);
        };
    }, [taglines]);

    return (
        <span
            className={`rounded-full bg-brand/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand transition-opacity duration-300 ${
                visible ? "opacity-100" : "opacity-0"
            }`}
        >
            {tagline ?? "..."}
        </span>
    );
}