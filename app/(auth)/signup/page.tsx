import Link from "next/link";
import { AnimatedBackground } from "@/components/AnimatedBackground";

export default function SignUpPage() {
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

          <form className="mt-8 flex flex-col gap-4 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="text-xs font-semibold uppercase tracking-wide text-foreground/70"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
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
                placeholder="you@example.com"
                className="rounded-lg border border-black/10 bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-white/10"
              />
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
            </div>

            <button
              type="submit"
              className="mt-2 rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-brand-foreground shadow-lg shadow-brand/30 transition hover:opacity-90"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-foreground/60">
            Already have an account?{" "}
            <Link href="/signin" className="font-semibold text-brand hover:opacity-80">
              Sign in
            </Link>
          </p>
        </div>
      </main>

      <footer className="relative z-10 mt-auto flex items-center justify-center px-6 py-6 text-xs text-foreground/50">
        © {new Date().getFullYear()} LVS F1 Fantasy. Not affiliated with
        Formula 1.
      </footer>
    </div>
  );
}
