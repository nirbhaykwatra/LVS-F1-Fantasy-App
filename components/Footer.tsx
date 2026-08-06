'use client'

export default function Footer() {
    return (
        <footer className="relative z-10 mt-auto flex items-center justify-center px-6 py-6 text-xs text-foreground/50">
            © {new Date().getFullYear()} LVS F1 Fantasy. Not affiliated with Formula 1.
        </footer>
    );
}