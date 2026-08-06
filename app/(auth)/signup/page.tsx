"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { signUp } from "@/app/actions/auth";
import type { ActionResponse } from "@/app/actions/auth";
import Footer from "@/components/Footer";

export default function SignUpPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ActionResponse | null, FormData>(
      signUp,
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
            <span className="text-sm text-foreground/60">Already racing?</span>
            <Link
                href="/signin"
                className="rounded-full px-4 py-2 text-sm font-semibold text-foreground transition hover:text-brand"
            >
              Sign In
            </Link>
          </nav>
        </header>

        <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-16 sm:px-10">
          <div className="w-full max-w-sm">
            <div className="flex flex-col gap-2 text-center">
            <span className="mx-auto rounded-full bg-brand/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
              Join the Grid
            </span>
              <h1 className="text-3xl font-black leading-tight text-foreground">
                Create your account
              </h1>
              <p className="text-sm text-foreground/60">
                Set up your driver profile and start building your dream team.
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
                  Username
                </label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="name"
                    placeholder="Max Verstappen"
                    className="rounded-lg border border-black/10 bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-white/10"
                />
              </div>

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
                    placeholder="max@verstappen.com"
                    className="rounded-lg border border-black/10 bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-white/10"
                />
                {state?.errors?.email && (
                    <p className="text-xs text-red-500">{state.errors.email[0]}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                    htmlFor="password"
                    className="text-xs font-semibold uppercase tracking-wide text-foreground/70"
                >
                  Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="rounded-lg border border-black/10 bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-white/10"
                />
                {state?.errors?.password && (
                    <p className="text-xs text-red-500">{state.errors.password[0]}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                    htmlFor="confirmPassword"
                    className="text-xs font-semibold uppercase tracking-wide text-foreground/70"
                >
                  Confirm Password
                </label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
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
                {isPending ? "Creating account…" : "Create Account"}
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
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                </svg>
                Continue with Discord
              </a>
            </form>

            <p className="mt-6 text-center text-sm text-foreground/60">
              Already have an account?{" "}
              <Link href="/signin" className="font-semibold text-brand hover:opacity-80">
                Sign in
              </Link>
            </p>
          </div>
        </main>

        <Footer />
      </div>
  );
}