import Link from "next/link";
import { AnimatedBackground } from "@/components/common/AnimatedBackground";
import { Tagline } from "@/components/landing/Tagline";
import { taglines } from "@/lib/utils";

const playerFeatures = [
  "Join F1 Fantasy Leagues",
  "Draft your team every race weekend",
  "View race results and driver standings",
  "Compare performance with friends",
  "Use power ups and counterpicks",
];

const managerFeatures = [
  "Create and manage leagues",
  "Add and remove players",
  "Track points and standings",
  "Customize league settings and rules",
  "Import and export league data",
];

const tickerItems = [
    "Create your own league",
    "Play against your friends",
    "Spice up your F1 experience",
    "Make your own rules",
    "Analyze your performance",
    "Dive into the data",
    "Unlock power ups",
];

function FeatureCard({
                       title,
                       items,
                     }: {
  title: string;
  items: string[];
}) {
  return (
      <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
              <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-foreground/70"
              >
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand" />
                {item}
              </li>
          ))}
        </ul>
      </div>
  );
}

function Ticker() {
  return (
      <div className="relative overflow-hidden border-y border-brand/20 bg-black py-3">
        <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-10 whitespace-nowrap will-change-transform hover:[animation-play-state:paused]">
          {[...tickerItems, ...tickerItems].map((item, i) => (
              <span
                  key={`${item}-${i}`}
                  className="flex items-center gap-3 font-mono text-xs font-bold tracking-widest text-white/80"
              >
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                {item}
          </span>
          ))}
        </div>
      </div>
  );
}

export default function Home() {
  return (
      <div className="relative isolate flex flex-1 flex-col bg-background font-sans">
        <AnimatedBackground />

        {/* Top bar */}
        <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
          <div className="flex items-center gap-2 font-mono text-sm font-bold tracking-widest text-foreground">
            <span className="h-2.5 w-2.5 rounded-full bg-brand" />
            LVS F1 FANTASY
          </div>
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
          <Ticker />
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