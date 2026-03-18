import { ToolPageLayout } from "@/components/ToolPageLayout";

export const metadata = {
  title: "FSMA 204 Compliance Checker - JoeLuT AI Tools",
  description:
    "Answer 6 questions to find out if the FDA Food Traceability Rule applies to your business.",
};

export default function FSMAPage() {
  return (
    <ToolPageLayout
      name="FSMA 204 Compliance Checker"
      description="Answer 6 questions to find out if the FDA Food Traceability Rule applies to your business."
    >
      <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
        {/* INSERT FSMA CHECKER COMPONENT HERE */}
        <div className="rounded-xl border border-border-light bg-bg p-8">
          <div className="mb-4 text-4xl">📋</div>
          <h3 className="mb-2 text-lg font-semibold">FSMA 204 Compliance Checker</h3>
          <p className="max-w-md text-sm text-text-secondary">
            The FSMA compliance checker will be embedded here. Answer 6 simple
            questions to determine if the FDA Food Traceability Rule (FSMA 204)
            applies to your food business.
          </p>
          <div className="mt-4 rounded-lg border border-dashed border-border p-4 text-xs text-text-muted">
            FSMA Checker component placeholder
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
