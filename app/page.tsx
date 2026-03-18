import { ToolCard } from "@/components/ToolCard";

const tools = [
  {
    name: "Food Pro AI",
    description:
      "Ask about recipe optimization, ingredient substitutions, or nutraceutical formulation. Instant answers.",
    href: "/foodpro",
    badge: "AI Chat",
    image: "/images/ai-food-scientist.png",
  },
  {
    name: "FoodCost Pro Calculator",
    description:
      "Calculate true product costs including ingredients, labor, packaging and overhead with pricing recommendations.",
    href: "/foodcost",
    badge: "Free",
    image: "/images/foodcost-pro.png",
  },
  {
    name: "FSMA 204 Compliance Checker",
    description:
      "Answer 6 questions to find out if the FDA Food Traceability Rule applies to your business.",
    href: "/fsma",
    badge: "Free",
    image: "/images/fsma-checker.png",
  },
  {
    name: "Bacterial Colony Counter",
    description:
      "Upload petri dish images and get instant AI-powered colony counts with computer vision analysis.",
    href: "/colony-counter",
    badge: "New",
    image: "/images/colony-counter.png",
  },
  {
    name: "Microglia Morphology Analyzer",
    description:
      "Upload microscopy images for instant cell classification with solidity, area, and morphological state analysis.",
    href: "/microglia",
    badge: "Popular",
    image: "/images/microglia-analyzer.png",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-28 pb-16">
      <div className="mb-16 max-w-2xl">
        <p className="animate-fade-in-up mb-3 text-sm font-medium text-accent">
          01/ Tools Hub
        </p>
        <h1 className="animate-fade-in-up stagger-1 mb-4 text-4xl font-bold leading-tight md:text-5xl">
          AI-powered tools for{" "}
          <span className="bg-gradient-to-r from-accent to-accent-blue bg-clip-text text-transparent">
            food science
          </span>{" "}
          and{" "}
          <span className="bg-gradient-to-r from-accent to-accent-blue bg-clip-text text-transparent">
            research
          </span>
        </h1>
        <p className="animate-fade-in-up stagger-2 text-lg text-text-secondary">
          Free intelligent tools built for food manufacturers and research
          scientists. No setup required.
        </p>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-text-muted">02/ Available Tools</p>
      </div>

      <div className="grid justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, i) => (
          <ToolCard key={tool.href} {...tool} index={i} />
        ))}
      </div>

      <div className="mt-20 max-w-2xl">
        <p className="mb-3 text-sm font-medium text-text-muted">03/ Custom Solutions</p>
        <h2 className="mb-4 text-2xl font-bold">Need something specific?</h2>
        <p className="mb-6 text-text-secondary">
          We build custom AI-powered tools for food manufacturers, research labs,
          and biotech companies. From formulation assistants to data analysis
          pipelines.
        </p>
        <a
          href="https://calendly.com/chiomaodo/intro-call"
          className="inline-block rounded-full bg-gradient-to-r from-accent to-accent-blue px-6 py-2.5 font-medium text-bg transition-opacity hover:opacity-90"
          target="_blank"
          rel="noopener noreferrer"
        >
          Book a Call
        </a>
      </div>
    </div>
  );
}
