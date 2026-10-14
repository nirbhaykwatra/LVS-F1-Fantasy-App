'use client';

import Link from "next/link";
import { signOut } from "@/app/actions/auth";

export interface ButtonProps {
    label: string;
    href: string;
}

export function SmallCard({ label, value }: { label: string, value: string}) {
    return (
        <div className="flex flex-col gap-2 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 overflow-hidden">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
                {label}
            </h2>
            <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
    );
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

export function SignOutButton() {
    return (
        <form onSubmit={async (e) => {
            e.preventDefault()
            await signOut()
        }}>
            <button className="rounded-full bg-brand/10 px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand/20" type="submit">Sign Out</button>
        </form>
    )
}