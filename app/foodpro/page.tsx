import { ToolPageLayout } from "@/components/ToolPageLayout";

export const metadata = {
  title: "Food Pro AI - JoeLuT AI Tools",
  description:
    "Ask about recipe optimization, ingredient substitutions, or nutraceutical formulation. Instant answers from an AI food scientist.",
};

export default function FoodProPage() {
  return (
    <ToolPageLayout
      name="Food Pro AI"
      description="Ask about recipe optimization, ingredient substitutions, or nutraceutical formulation. Instant answers from an AI food scientist."
    >
      <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
        {/* INSERT DANTE AI WIDGET EMBED CODE HERE */}
        <div className="rounded-xl border border-border-light bg-bg p-8">
          <div className="mb-4 text-4xl">🤖</div>
          <h3 className="mb-2 text-lg font-semibold">AI Food Scientist Chat</h3>
          <p className="max-w-md text-sm text-text-secondary">
            The Dante AI chat widget will be embedded here. Ask questions about
            recipe formulation, ingredient functionality, shelf life, regulatory
            compliance, and more.
          </p>
          <div className="mt-4 rounded-lg border border-dashed border-border p-4 text-xs text-text-muted">
            Dante AI widget placeholder
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
