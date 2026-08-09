"use client";

import { useActionState, useState } from "react";

export type CreateLeagueState = { error: string | null };

const VISIBILITY_OPTIONS = ["private", "public"] as const;
type Visibility = (typeof VISIBILITY_OPTIONS)[number];

export function CreateLeagueForm({
                                     action,
                                 }: {
    action: (prevState: CreateLeagueState, formData: FormData) => Promise<CreateLeagueState>;
}) {
    const [state, formAction, pending] = useActionState<CreateLeagueState, FormData>(action, {
        error: null,
    });
    const [visibility, setVisibility] = useState<Visibility>("private");

    return (
        <form action={formAction} className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <label
                    htmlFor="name"
                    className="text-xs font-bold uppercase tracking-widest text-foreground/50"
                >
                    League Name
                </label>
                <input
                    id="name"
                    name="name"
                    required
                    maxLength={40}
                    placeholder="e.g. Paddock Club"
                    autoComplete="off"
                    className="w-full rounded-xl border border-black/15 bg-transparent px-4 py-3 text-base font-semibold text-foreground placeholder:text-foreground/30 outline-none transition focus:border-brand dark:border-white/20"
                />
            </div>

            <fieldset className="flex flex-col gap-3">
                <legend className="text-xs font-bold uppercase tracking-widest text-foreground/50">
                    Visibility
                </legend>

                <div className="relative flex rounded-xl border border-black/15 p-1 dark:border-white/20">
          <span
              className="absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-lg bg-brand transition-transform duration-200 ease-out"
              style={{
                  transform:
                      visibility === "private"
                          ? "translateX(0%)"
                          : "translateX(calc(100% + 0.5rem))",
              }}
              aria-hidden
          />
                    {VISIBILITY_OPTIONS.map((option) => (
                        <label
                            key={option}
                            className="relative z-10 flex-1 cursor-pointer select-none rounded-lg py-2.5 text-center text-sm font-semibold capitalize transition"
                        >
                            <input
                                type="radio"
                                name="visibility"
                                value={option}
                                checked={visibility === option}
                                onChange={() => setVisibility(option)}
                                className="sr-only"
                            />
                            <span
                                className={
                                    visibility === option ? "text-brand-foreground" : "text-foreground/60"
                                }
                            >
                {option}
              </span>
                        </label>
                    ))}
                </div>

                <p className="text-xs text-foreground/50">
                    {visibility === "public"
                        ? "Anyone in the league can send invites, and standings are visible to spectators who haven't signed up."
                        : "Only admins can create invites, and league data is only visible to participants."}
                </p>
            </fieldset>

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
                {pending ? "Creating…" : "Create League"}
            </button>
        </form>
    );
}