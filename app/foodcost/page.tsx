import { ToolPageLayout } from "@/components/ToolPageLayout";

export const metadata = {
  title: "FoodCost Pro Calculator - JoeLuT AI Tools",
  description:
    "Calculate true product costs including ingredients, labor, packaging and overhead with pricing recommendations.",
};

export default function FoodCostPage() {
  return (
    <ToolPageLayout
      name="FoodCost Pro Calculator"
      description="Calculate true product costs including ingredients, labor, packaging and overhead with pricing recommendations."
    >
      <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
        {/* INSERT FOODCOST PRO WIDGET/COMPONENT HERE */}
        <div className="rounded-xl border border-border-light bg-bg p-8">
          <div className="mb-4 text-4xl">💰</div>
          <h3 className="mb-2 text-lg font-semibold">FoodCost Pro Calculator</h3>
          <p className="max-w-md text-sm text-text-secondary">
            The cost calculator component will be embedded here. Input your
            ingredients, labor rates, packaging costs, and overhead to get
            accurate product costing with recommended retail pricing.
          </p>
          <div className="mt-4 rounded-lg border border-dashed border-border p-4 text-xs text-text-muted">
            FoodCost Pro widget placeholder
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
