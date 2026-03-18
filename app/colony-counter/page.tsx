import { ToolPageLayout } from "@/components/ToolPageLayout";

export const metadata = {
  title: "Bacterial Colony Counter - JoeLuT AI Tools",
  description:
    "Upload petri dish images and get instant AI-powered colony counts with computer vision analysis.",
};

export default function ColonyCounterPage() {
  return (
    <ToolPageLayout
      name="Bacterial Colony Counter"
      description="Upload petri dish images and get instant AI-powered colony counts with computer vision analysis."
    >
      <div className="flex min-h-[500px] flex-col items-center justify-center">
        <iframe
          src="https://colonycount.netlify.app"
          className="h-[600px] w-full rounded-lg border border-border"
          title="Bacterial Colony Counter"
          allow="camera"
        />
      </div>
    </ToolPageLayout>
  );
}
