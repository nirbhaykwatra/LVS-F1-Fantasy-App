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
                    htmlFor="username"
                    className="text-xs font-semibold uppercase tracking-wide text-foreground/70"
                >
                  Email
                </label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="name"
                    placeholder="Max Verstappen"
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