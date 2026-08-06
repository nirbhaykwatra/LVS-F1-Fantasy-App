export default function SmallCard({ label, value }: { label: string, value: string}) {
    return (
        <div className="flex flex-col gap-2 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
                {label}
            </h2>
            <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
    );
}