import Link from "next/link";

interface ToolPageLayoutProps {
  name: string;
  description: string;
  children: React.ReactNode;
}

export function ToolPageLayout({ name, description, children }: ToolPageLayoutProps) {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-28 pb-16">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-accent"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to All Tools
      </Link>

      <div className="animate-fade-in-up mb-8">
        <h1 className="mb-3 text-3xl font-bold md:text-4xl">{name}</h1>
        <p className="max-w-2xl text-lg text-text-secondary">{description}</p>
      </div>

      <div className="animate-fade-in-up stagger-2 min-h-[400px] rounded-2xl border border-border bg-surface p-6 md:p-8">
        {children}
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-surface-light p-6 text-center">
        <p className="mb-3 text-sm text-text-secondary">
          Need a custom tool built for your business?
        </p>
        <a
          href="https://calendly.com/chiomaodo/intro-call"
          className="inline-block rounded-full bg-gradient-to-r from-accent to-accent-blue px-6 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90"
          target="_blank"
          rel="noopener noreferrer"
        >
          Book a Call
        </a>
      </div>
    </div>
  );
}
