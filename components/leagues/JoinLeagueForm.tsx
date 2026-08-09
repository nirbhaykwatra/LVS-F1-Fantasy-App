"use client";

import { useActionState } from "react";

export type JoinLeagueState = { error: string | null };

export function JoinLeagueForm({
                                   action,
                               }: {
    action: (prevState: JoinLeagueState, formData: FormData) => Promise<JoinLeagueState>;
}) {
    const [state, formAction, pending] = useActionState<JoinLeagueState, FormData>(action, {
        error: null,
    });

    return (
        <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="flex flex-1 flex-col gap-1.5">
                <label htmlFor="inviteCode" className="sr-only">
                    Invite code
                </label>
                <input
                    id="inviteCode"
                    name="inviteCode"
                    required
                    maxLength={12}
                    placeholder="e.g. 7F3K9Q"
                    autoCapitalize="characters"
                    autoComplete="off"
                    className="w-full rounded-xl border border-black/15 bg-transparent px-4 py-2.5 font-mono text-sm uppercase tracking-[0.2em] text-foreground placeholder:text-foreground/30 outline-none transition focus:border-brand dark:border-white/20"
                />
                {state.error && (
                    <span role="alert" className="text-xs font-medium text-brand">
            {state.error}
          </span>
                )}
            </div>

            <button
                type="submit"
                disabled={pending}
                className="shrink-0 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-brand-foreground transition hover:opacity-90 disabled:opacity-50"
            >
                {pending ? "Joining…" : "Join League"}
            </button>
        </form>
    );
}