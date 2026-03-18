export function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-text-secondary">
            Need a custom tool built for your business?
          </p>
          <a
            href="https://calendly.com/chiomaodo/intro-call"
            className="rounded-full bg-gradient-to-r from-accent to-accent-blue px-6 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90"
            target="_blank"
            rel="noopener noreferrer"
          >
            Book a Call
          </a>
          <p className="mt-4 text-xs text-text-muted">
            &copy; {new Date().getFullYear()} JoeLuT AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
