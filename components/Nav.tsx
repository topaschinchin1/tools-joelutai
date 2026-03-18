import Link from "next/link";

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-accent to-accent-blue bg-clip-text text-lg font-bold text-transparent">
            JoeLuT AI
          </span>
          <span className="rounded-full border border-border px-2 py-0.5 text-xs text-text-muted">
            Tools
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-text-secondary transition-colors hover:text-text"
          >
            All Tools
          </Link>
          <a
            href="https://joelutai.com"
            className="text-sm text-text-secondary transition-colors hover:text-text"
            target="_blank"
            rel="noopener noreferrer"
          >
            joelutai.com
          </a>
          <a
            href="https://calendly.com/chiomaodo/intro-call"
            className="rounded-full bg-gradient-to-r from-accent to-accent-blue px-4 py-1.5 text-sm font-medium text-bg transition-opacity hover:opacity-90"
            target="_blank"
            rel="noopener noreferrer"
          >
            Book a Call
          </a>
        </div>
      </div>
    </nav>
  );
}
