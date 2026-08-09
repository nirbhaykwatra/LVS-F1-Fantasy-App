"use client";

import { useActionState } from "react";

export type JoinLeagueTeamState = { error: string | null };

export function JoinLeagueTeamForm({
                                       code,
                                       action,
                                   }: {
    code: string;
    action: (prevState: JoinLeagueTeamState, formData: FormData) => Promise<JoinLeagueTeamState>;
}) {
    const [state, formAction, pending] = useActionState<JoinLeagueTeamState, FormData>(action, {
        error: null,
    });

    return (
        <form action={formAction} className="flex flex-col gap-8">
            <input type="hidden" name="code" value={code} />

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="teamName"
                    className="text-xs font-bold uppercase tracking-widest text-foreground/50"
                >
                    Team Name
                </label>
                <input
                    id="teamName"
                    name="teamName"
                    required
                    maxLength={30}
                    placeholder="e.g. Midfield Marauders"
                    autoComplete="off"
                    className="w-full rounded-xl border border-black/15 bg-transparent px-4 py-3 text-base font-semibold text-foreground placeholder:text-foreground/30 outline-none transition focus:border-brand dark:border-white/20"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="teamMotto"
                    className="text-xs font-bold uppercase tracking-widest text-foreground/50"
                >
                    Team Motto
                </label>
                <input
                    id="teamMotto"
                    name="teamMotto"
                    required
                    maxLength={80}
                    placeholder="e.g. Last on the grid, first to the podium"
                    autoComplete="off"
                    className="w-full rounded-xl border border-black/15 bg-transparent px-4 py-3 text-sm italic text-foreground placeholder:text-foreground/30 outline-none transition focus:border-brand dark:border-white/20"
                />
                <span className="text-right text-[11px] text-foreground/30">Up to 80 characters</span>
            </div>

            {state.error && (
                <p role="alert" className="text-sm font-medium text-brand">
                    {state.error}
                </p>
            )}

            <button
                type="submit"
                disabled={pending}
                className="w-full rounded-full bg-brand px-6 py-3 text-sm font-bold text-brand-foreground transition hover:opacity-90 disabled:opacity-50 sm:w-fit"
            >
                {pending ? "Joining…" : "Join League"}
            </button>
        </form>
    );
}