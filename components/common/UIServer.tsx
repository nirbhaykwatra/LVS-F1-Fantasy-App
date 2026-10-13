import { getCurrentUser } from "@/lib/dal/user";

export async function PlayerNameNav() {
    const user = await getCurrentUser();
    if (!user) return null;

    return (
        <div>
            {user?.username}
        </div>
    );
}

export function FeatureCard({ title, items }: { title: string; items: string[]; }) {
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

export function Ticker({ tickerItems }: { tickerItems: string[] }) {
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
