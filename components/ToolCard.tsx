import Link from "next/link";

interface ToolCardProps {
  name: string;
  description: string;
  href: string;
  badge: string;
  badgeColor?: string;
  index: number;
}

const badgeColors: Record<string, string> = {
  Free: "border-accent/30 text-accent bg-accent/10",
  New: "border-blue-500/30 text-blue-400 bg-blue-500/10",
  Popular: "border-purple-500/30 text-purple-400 bg-purple-500/10",
  "AI Chat": "border-amber-500/30 text-amber-400 bg-amber-500/10",
};

export function ToolCard({ name, description, href, badge, index }: ToolCardProps) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={href}
      className={`animate-fade-in-up stagger-${index + 1} group relative block rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:border-border-light hover:bg-surface-light`}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium text-text-muted">{num}/</span>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${badgeColors[badge] || "border-border text-text-muted"}`}
        >
          {badge}
        </span>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-text transition-colors group-hover:text-accent">
        {name}
      </h3>
      <p className="text-sm leading-relaxed text-text-secondary">{description}</p>
      <div className="mt-4 flex items-center gap-1 text-sm text-text-muted transition-colors group-hover:text-accent">
        <span>Open tool</span>
        <svg
          className="h-4 w-4 transition-transform group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
