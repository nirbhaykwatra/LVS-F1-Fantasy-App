"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { signIn } from "@/app/actions/auth";
import type { ActionResponse } from "@/app/actions/auth";

export default function SignInPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ActionResponse | null, FormData>(
      signIn,
      null
  );

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard");
    }
  }, [state, router]);

  return (
      <div className="relative isolate flex flex-1 flex-col bg-background font-sans">
        <AnimatedBackground />

        <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
          <Link
              href="/"
              className="flex items-center gap-2 font-mono text-sm font-bold tracking-widest text-foreground"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-brand" />
            LVS F1 FANTASY
          </Link>
          <nav className="flex items-center gap-3">
            <span className="text-sm text-foreground/60">New here?</span>
            <Link
                href="/signup"
                className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition hover:opacity-90"
            >
              Sign Up
            </Link>
          </nav>
        </header>

        <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-16 sm:px-10">
          <div className="w-full max-w-sm">
            <div className="flex flex-col gap-2 text-center">
            <span className="mx-auto rounded-full bg-brand/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
              Welcome Back
            </span>
              <h1 className="text-3xl font-black leading-tight text-foreground">
                Sign in to your garage
              </h1>
              <p className="text-sm text-foreground/60">
                Jump back into your leagues and get ready for the next race.
              </p>
            </div>

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
                <label
                    htmlFor="email"
                    className="text-xs font-semibold uppercase tracking-wide text-foreground/70"
                >
                  Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="rounded-lg border border-black/10 bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-white/10"
                />
                {state?.errors?.email && (
                    <p className="text-xs text-red-500">{state.errors.email[0]}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                      htmlFor="password"
                      className="text-xs font-semibold uppercase tracking-wide text-foreground/70"
                  >
                    Password
                  </label>
                  <Link
                      href="#"
                      className="text-xs font-semibold text-brand hover:opacity-80"
                  >
                    Forgot?
                  </Link>
                </div>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="rounded-lg border border-black/10 bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-white/10"
                />
                {state?.errors?.password && (
                    <p className="text-xs text-red-500">{state.errors.password[0]}</p>
                )}
              </div>

              <button
                  type="submit"
                  disabled={isPending}
                  className="mt-2 rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-brand-foreground shadow-lg shadow-brand/30 transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? "Signing in…" : "Sign In"}
              </button>

              <div className="relative flex items-center gap-3">
                <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
                <span className="text-xs text-foreground/40">or</span>
                <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
              </div>

              <a
                  href="/api/auth/discord"
                  className="flex items-center justify-center gap-2.5 rounded-full border border-black/10 bg-[#5865F2] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90 dark:border-white/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.003.024.015.046.032.06a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                </svg>
                Continue with Discord
              </a>
            </form>

            <p className="mt-6 text-center text-sm text-foreground/60">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold text-brand hover:opacity-80">
                Sign up
              </Link>
            </p>
          </div>
        </main>

        <footer className="relative z-10 mt-auto flex items-center justify-center px-6 py-6 text-xs text-foreground/50">
          © {new Date().getFullYear()} LVS F1 Fantasy. Not affiliated with Formula 1.
        </footer>
      </div>
  );
}