"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { completeDiscordSignup } from "@/app/actions/auth";
import type { ActionResponse } from "@/app/actions/auth";

export default function CompleteSignupForm() {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState<ActionResponse | null, FormData>(
        completeDiscordSignup,
        null
    );

    useEffect(() => {
        if (state?.success) {
            router.push("/dashboard");
        }
    }, [state, router]);

    return (
        <form
            action={formAction}
            className="mt-8 flex flex-col gap-4 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
        >
            {state && !state.success && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
                    {state.message}
                </p>
            )}

            <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    className="rounded-lg border border-black/10 bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-white/10"
                />
                {state?.errors?.email && (
                    <p className="text-xs text-red-500">{state.errors.email[0]}</p>
                )}
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    required
                    className="rounded-lg border border-black/10 bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-white/10"
                />
                {state?.errors?.password && (
                    <p className="text-xs text-red-500">{state.errors.password[0]}</p>
                )}
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
                    Confirm Password
                </label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    required
                    className="rounded-lg border border-black/10 bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-white/10"
                />
                {state?.errors?.confirmPassword && (
                    <p className="text-xs text-red-500">{state.errors.confirmPassword[0]}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="mt-2 rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-brand-foreground shadow-lg shadow-brand/30 transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {isPending ? "Completing sign up…" : "Complete Sign Up"}
            </button>
        </form>
    );
}