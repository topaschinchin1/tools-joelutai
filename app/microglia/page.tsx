import { ToolPageLayout } from "@/components/ToolPageLayout";

export const metadata = {
  title: "Microglia Morphology Analyzer - JoeLuT AI Tools",
  description:
    "Upload microscopy images for instant cell classification with solidity, area, and morphological state analysis.",
};

export default function MicrogliaPage() {
  return (
    <ToolPageLayout
      name="Microglia Morphology Analyzer"
      description="Upload microscopy images for instant cell classification with solidity, area, and morphological state analysis."
    >
      <div className="flex min-h-[500px] flex-col items-center justify-center">
        <iframe
          src="https://joelutai-microglia-analysis.netlify.app"
          className="h-[600px] w-full rounded-lg border border-border"
          title="Microglia Morphology Analyzer"
          allow="camera"
        />
      </div>
    </ToolPageLayout>
  );
}
