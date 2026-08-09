'use client';

import Link from "next/link";

export interface ButtonProps {
    label: string;
    href: string;
}

export function ButtonPill({ label, href }: ButtonProps) {
    return (
        <Link href={href} className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition hover:opacity-90">
            {label}
        </Link>
    )
}

export function ButtonRounded({ label, href }: ButtonProps) {
    return (
        <Link href={href} className="rounded-2xl bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition hover:opacity-90">
            {label}
        </Link>
    )
}