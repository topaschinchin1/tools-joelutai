import Image from "next/image";
import Link from "next/link";

interface ToolCardProps {
  name: string;
  description: string;
  href: string;
  badge: string;
  image: string;
  badgeColor?: string;
  index: number;
}

const badgeColors: Record<string, string> = {
  Free: "border-accent/30 text-accent bg-accent/10",
  New: "border-blue-500/30 text-blue-400 bg-blue-500/10",
  Popular: "border-purple-500/30 text-purple-400 bg-purple-500/10",
  "AI Chat": "border-amber-500/30 text-amber-400 bg-amber-500/10",
};

export function ToolCard({ name, description, href, badge, image, index }: ToolCardProps) {
  return (
    <Link
      href={href}
      className={`animate-fade-in-up stagger-${index + 1} group relative flex h-[320px] w-[320px] flex-col items-center justify-center rounded-full border border-border bg-surface p-10 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/20 hover:bg-surface-light`}
    >
      <span
        className={`absolute top-8 rounded-full border px-2.5 py-0.5 text-xs font-medium ${badgeColors[badge] || "border-border text-text-muted"}`}
      >
        {badge}
      </span>
      <Image
        src={image}
        alt={name}
        width={64}
        height={64}
        className="mb-3 rounded-lg object-contain"
      />
      <h3 className="mb-1 text-base font-semibold text-text transition-colors group-hover:text-accent">
        {name}
      </h3>
      <p className="line-clamp-2 text-xs leading-relaxed text-text-secondary">
        {description}
      </p>
      <span className="mt-2 text-sm text-text-muted transition-colors group-hover:text-accent">
        Try It Free &rarr;
      </span>
    </Link>
  );
}
