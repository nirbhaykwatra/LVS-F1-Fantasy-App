import Link from "next/link";
import { AnimatedBackground } from "@/components/common/AnimatedBackground";
import { Tagline } from "@/components/landing/Tagline";
import { taglines, playerFeatures, managerFeatures, tickerItems } from "@/lib/utils";
import { FeatureCard, Ticker } from "@/components/common/UIServer";
import { HeaderLogoButton } from "@/components/common/Header";

export default function Home() {
  return (
      <div className="relative isolate flex flex-1 flex-col bg-background font-sans">
        <AnimatedBackground />

        {/* Top bar */}
        <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
            <HeaderLogoButton />
          <nav className="flex items-center gap-3">
            <Link
                href="/signin"
                className="rounded-full px-4 py-2 text-sm font-semibold text-foreground transition hover:text-brand"
            >
              Sign In
            </Link>
            <Link
                href="/signup"
                className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition hover:opacity-90"
            >
              Sign Up
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="relative z-10 flex flex-col items-center gap-6 px-6 pt-16 pb-20 text-center sm:px-10">
          <Tagline taglines={taglines}/>
          <h1 className="max-w-3xl text-5xl font-black leading-tight text-foreground sm:text-6xl">
              <span className="text-brand font-rammetto">LVS Formula 1 Fantasy</span>
          </h1>
          <h3 className="max-w-3xl text-2xl font-black leading-tight text-foreground sm:text-6xl">
            Run your own F1 Fantasy league with friends
          </h3>
          <p className="max-w-xl text-base text-foreground/70 sm:text-lg">
            Draft your team, track live standings, and outsmart your friends
            with power ups and counterpicks — race after race, season after
            season.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link
                href="/signup"
                className="rounded-full bg-brand px-8 py-3 text-sm font-bold text-brand-foreground shadow-lg shadow-brand/30 transition hover:opacity-90"
            >
              Get Started
            </Link>
            <Link
                href="/signin"
                className="rounded-full border border-black/15 px-8 py-3 text-sm font-bold text-foreground transition hover:border-brand hover:text-brand dark:border-white/20"
            >
              I already have an account
            </Link>
          </div>
        </section>

        {/* Ticker */}
        <div className="relative z-10">
          <Ticker tickerItems={tickerItems}/>
        </div>

        {/* Features */}
        <section className="relative z-10 flex flex-col gap-10 px-6 py-16 sm:px-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Built for every seat on the grid
            </h2>
            <p className="max-w-md text-sm text-foreground/60">
              Whether you&apos;re racing for the title, running the league, or
              keeping everything on track.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <FeatureCard title="For Players" items={playerFeatures} />
            <FeatureCard title="For League Managers" items={managerFeatures} />
          </div>
        </section>

        {/* CTA */}
        <section className="relative z-10 flex flex-col items-center gap-4 border-t border-black/10 px-6 py-16 text-center dark:border-white/10">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Ready to start your season?
          </h2>
          <p className="max-w-md text-sm text-foreground/60">
            Create a league, invite your friends, and start drafting before
            lights out.
          </p>
          <Link
              href="/signup"
              className="mt-2 rounded-full bg-brand px-8 py-3 text-sm font-bold text-brand-foreground shadow-lg shadow-brand/30 transition hover:opacity-90"
          >
            Create your league
          </Link>
        </section>
      </div>
  );
}