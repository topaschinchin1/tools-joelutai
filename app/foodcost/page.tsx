"use client";

import Link from "next/link";
import { useRef, useState } from "react";

const LEAD_WEBHOOK_URL = "https://joelut.app.n8n.cloud/webhook/foodcost-lead";

interface Ingredient {
  id: number;
  name: string;
  qty: string;
  unit: string;
  cost: string;
}

interface Results {
  ingredientCostUnit: number;
  laborCostUnit: number;
  packagingCostUnit: number;
  overheadCostUnit: number;
  totalCostUnit: number;
  profitMargin: number;
  breakEvenPrice: number;
  recommendedPrice: number;
  premiumPrice: number;
  targetMargin: number;
  breakdown: {
    label: string;
    perBatch: number;
    perUnit: number;
    pct: number;
  }[];
}

let nextId = 1;

export default function FoodCostPage() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [gateError, setGateError] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: nextId++, name: "", qty: "", unit: "lbs", cost: "" },
  ]);
  const [results, setResults] = useState<Results | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  async function submitGate() {
    if (!userName.trim()) { setGateError("Please enter your name"); return; }
    if (!userEmail.trim() || !userEmail.includes("@")) { setGateError("Please enter a valid email"); return; }
    setGateError("");

    // Send lead to n8n webhook -> Google Sheets
    try {
      fetch(LEAD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName.trim(),
          email: userEmail.trim(),
          tool: "FoodCost Pro Calculator",
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});
    } catch {
      // Don't block user if webhook fails
    }

    setUnlocked(true);
  }

  function addIngredient() {
    setIngredients((prev) => [
      ...prev,
      { id: nextId++, name: "", qty: "", unit: "lbs", cost: "" },
    ]);
  }

  function removeIngredient(id: number) {
    if (ingredients.length <= 1) return;
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  }

  function updateIngredient(id: number, field: keyof Ingredient, value: string) {
    setIngredients((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  }

  function calculate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const batchSize = parseFloat((form.elements.namedItem("batchSize") as HTMLInputElement).value) || 1;
    const laborHours = parseFloat((form.elements.namedItem("laborHours") as HTMLInputElement).value) || 0;
    const hourlyWage = parseFloat((form.elements.namedItem("hourlyWage") as HTMLInputElement).value) || 15;
    const packagingCost = parseFloat((form.elements.namedItem("packagingCost") as HTMLInputElement).value) || 0;
    const overheadPct = parseFloat((form.elements.namedItem("overheadPct") as HTMLInputElement).value) || 15;
    const sellingPrice = parseFloat((form.elements.namedItem("sellingPrice") as HTMLInputElement).value) || 0;
    const targetMargin = parseFloat((form.elements.namedItem("targetMargin") as HTMLInputElement).value) || 30;

    let totalIngredientCost = 0;
    ingredients.forEach((ing) => {
      totalIngredientCost += parseFloat(ing.cost) || 0;
    });

    const laborCostBatch = laborHours * hourlyWage;
    const packagingCostBatch = packagingCost * batchSize;
    const subtotal = totalIngredientCost + laborCostBatch + packagingCostBatch;
    const overheadCostBatch = subtotal * (overheadPct / 100);
    const totalCostBatch = subtotal + overheadCostBatch;

    const ingredientCostUnit = totalIngredientCost / batchSize;
    const laborCostUnit = laborCostBatch / batchSize;
    const packagingCostUnit = packagingCost;
    const overheadCostUnit = overheadCostBatch / batchSize;
    const totalCostUnit = totalCostBatch / batchSize;

    const breakEvenPrice = totalCostUnit;
    const recommendedPrice = totalCostUnit / (1 - targetMargin / 100);
    const premiumPrice = totalCostUnit / 0.5;

    let profitMargin = 0;
    if (sellingPrice > 0) {
      profitMargin = ((sellingPrice - totalCostUnit) / sellingPrice) * 100;
    }

    const total = totalCostBatch;
    setResults({
      ingredientCostUnit,
      laborCostUnit,
      packagingCostUnit,
      overheadCostUnit,
      totalCostUnit,
      profitMargin,
      breakEvenPrice,
      recommendedPrice,
      premiumPrice,
      targetMargin,
      breakdown: [
        { label: "Ingredients", perBatch: totalIngredientCost, perUnit: ingredientCostUnit, pct: (totalIngredientCost / total) * 100 },
        { label: "Labor", perBatch: laborCostBatch, perUnit: laborCostUnit, pct: (laborCostBatch / total) * 100 },
        { label: "Packaging", perBatch: packagingCostBatch, perUnit: packagingCostUnit, pct: (packagingCostBatch / total) * 100 },
        { label: `Overhead (${overheadPct}%)`, perBatch: overheadCostBatch, perUnit: overheadCostUnit, pct: (overheadCostBatch / total) * 100 },
        { label: "TOTAL", perBatch: totalCostBatch, perUnit: totalCostUnit, pct: 100 },
      ],
    });

    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  const fmt = (n: number) => "$" + n.toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 text-gray-800">
      <header className="flex items-center justify-between bg-green-800 px-8 py-4 text-white">
        <div className="text-xl font-bold">
          JoeLuT<span className="text-orange-400">AI</span>
        </div>
        <Link href="/" className="text-sm text-white/90 hover:text-white">
          &larr; Back to Tools
        </Link>
      </header>

      <section className="py-10 text-center">
        <span className="mb-3 inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
          100% Free Tool
        </span>
        <h1 className="mb-2 text-4xl font-bold text-green-800">FoodCost Pro Calculator</h1>
        <p className="mx-auto max-w-xl text-gray-500">
          Calculate your true product costs including ingredients, labor, packaging, and overhead. Know your margins before you price.
        </p>
      </section>

      {/* Email Gate */}
      {!unlocked && (
        <div className="mx-auto max-w-md px-4 pb-16">
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <div className="mb-4 text-center text-5xl">💰</div>
            <h2 className="mb-2 text-center text-xl font-bold text-green-800">Get Started for Free</h2>
            <p className="mb-6 text-center text-sm text-gray-500">
              Enter your name and email to access the calculator. No spam, just useful food business insights.
            </p>
            <input
              type="text"
              placeholder="Your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="mb-3 w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:border-green-800 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Your email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), submitGate())}
              className="mb-3 w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:border-green-800 focus:outline-none"
            />
            {gateError && <p className="mb-3 text-center text-sm text-orange-600">{gateError}</p>}
            <button
              type="button"
              onClick={submitGate}
              className="w-full rounded-xl bg-gradient-to-r from-green-800 to-green-600 px-8 py-4 text-lg font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Open Calculator &rarr;
            </button>
            <p className="mt-4 text-center text-xs text-gray-400">
              Powered by <span className="font-semibold text-green-700">JoeLuT AI</span>
            </p>
          </div>
        </div>
      )}

      {unlocked && <><form onSubmit={calculate} className="mx-auto max-w-[900px] px-4 pb-12">
        {/* Product Details */}
        <div className="mb-6 rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-green-800">
            📦 Product Details
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Product Name</label>
              <input name="productName" type="text" placeholder="e.g., Chin Chin 250g" className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-base focus:border-green-800 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Batch Size (units produced)</label>
              <input name="batchSize" type="number" placeholder="e.g., 24" min={1} className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-base focus:border-green-800 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="mb-6 rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-green-800">
            🥘 Ingredients
          </h2>
          {ingredients.map((ing) => (
            <div key={ing.id} className="mb-3 grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-end gap-3 max-sm:grid-cols-2">
              <input type="text" placeholder="Ingredient name" value={ing.name} onChange={(e) => updateIngredient(ing.id, "name", e.target.value)} className="rounded-lg border-2 border-gray-200 px-3 py-2.5 focus:border-green-800 focus:outline-none max-sm:col-span-2" />
              <input type="number" placeholder="Qty" step={0.01} value={ing.qty} onChange={(e) => updateIngredient(ing.id, "qty", e.target.value)} className="rounded-lg border-2 border-gray-200 px-3 py-2.5 focus:border-green-800 focus:outline-none" />
              <input type="text" placeholder="Unit" value={ing.unit} onChange={(e) => updateIngredient(ing.id, "unit", e.target.value)} className="rounded-lg border-2 border-gray-200 px-3 py-2.5 focus:border-green-800 focus:outline-none" />
              <input type="number" placeholder="Cost $" step={0.01} value={ing.cost} onChange={(e) => updateIngredient(ing.id, "cost", e.target.value)} className="rounded-lg border-2 border-gray-200 px-3 py-2.5 focus:border-green-800 focus:outline-none" />
              <button type="button" onClick={() => removeIngredient(ing.id)} className="h-10 w-10 rounded-lg bg-red-100 text-lg text-red-600 hover:bg-red-200">
                &times;
              </button>
            </div>
          ))}
          <button type="button" onClick={addIngredient} className="mt-2 flex items-center gap-2 rounded-lg bg-green-100 px-5 py-3 font-semibold text-green-800 hover:bg-green-200">
            + Add Ingredient
          </button>
        </div>

        {/* Labor & Overhead */}
        <div className="mb-6 rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-green-800">
            👷 Labor &amp; Overhead
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Labor Hours (per batch)</label>
              <input name="laborHours" type="number" placeholder="e.g., 4" step={0.5} className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:border-green-800 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Hourly Wage ($)</label>
              <input name="hourlyWage" type="number" placeholder="15.00" step={0.5} className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:border-green-800 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Packaging Cost (per unit)</label>
              <input name="packagingCost" type="number" placeholder="0.50" step={0.01} className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:border-green-800 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Overhead % (rent, utilities)</label>
              <input name="overheadPct" type="number" placeholder="15" defaultValue={15} className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:border-green-800 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-6 rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-green-800">
            💰 Pricing
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Target Selling Price (per unit)</label>
              <input name="sellingPrice" type="number" placeholder="12.00" step={0.01} className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:border-green-800 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Target Profit Margin %</label>
              <input name="targetMargin" type="number" placeholder="30" defaultValue={30} className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:border-green-800 focus:outline-none" />
            </div>
          </div>
          <button type="submit" className="mt-6 w-full rounded-xl bg-gradient-to-r from-green-800 to-green-600 px-8 py-4 text-lg font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
            Calculate Product Costs
          </button>
        </div>

        {/* Results */}
        {results && (
          <div ref={resultsRef} className="rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-green-800">
              📊 Cost Breakdown
            </h2>
            <div className="mb-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
              <div className="rounded-xl bg-gray-50 p-4 text-center">
                <div className="text-sm text-gray-500">Ingredient/Unit</div>
                <div className="text-xl font-bold text-green-800">{fmt(results.ingredientCostUnit)}</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 text-center">
                <div className="text-sm text-gray-500">Labor/Unit</div>
                <div className="text-xl font-bold text-green-800">{fmt(results.laborCostUnit)}</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 text-center">
                <div className="text-sm text-gray-500">Packaging/Unit</div>
                <div className="text-xl font-bold text-green-800">{fmt(results.packagingCostUnit)}</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 text-center">
                <div className="text-sm text-gray-500">Overhead/Unit</div>
                <div className="text-xl font-bold text-green-800">{fmt(results.overheadCostUnit)}</div>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-green-800 to-green-600 p-4 text-center text-white">
                <div className="text-sm text-white/80">Total Cost/Unit</div>
                <div className="text-xl font-bold">{fmt(results.totalCostUnit)}</div>
              </div>
              <div className={`rounded-xl p-4 text-center ${results.profitMargin < 20 ? "bg-amber-50" : results.profitMargin >= 30 ? "bg-gradient-to-br from-green-800 to-green-600 text-white" : "bg-gray-50"}`}>
                <div className={`text-sm ${results.profitMargin >= 30 ? "text-white/80" : "text-gray-500"}`}>Profit Margin</div>
                <div className={`text-xl font-bold ${results.profitMargin < 20 ? "text-amber-600" : results.profitMargin >= 30 ? "text-white" : "text-green-800"}`}>
                  {results.profitMargin.toFixed(1)}%
                </div>
              </div>
            </div>

            <h3 className="mb-4 mt-6 font-semibold text-green-800">Recommended Pricing</h3>
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-gray-50 p-4 text-center">
                <div className="text-sm text-gray-500">Min Price (Break Even)</div>
                <div className="text-xl font-bold text-green-800">{fmt(results.breakEvenPrice)}</div>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-green-800 to-green-600 p-4 text-center text-white">
                <div className="text-sm text-white/80">Target Price ({results.targetMargin}% margin)</div>
                <div className="text-xl font-bold">{fmt(results.recommendedPrice)}</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 text-center">
                <div className="text-sm text-gray-500">Premium Price (50% margin)</div>
                <div className="text-xl font-bold text-green-800">{fmt(results.premiumPrice)}</div>
              </div>
            </div>

            <h3 className="mb-4 mt-6 font-semibold text-green-800">Detailed Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-gray-200 px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">Category</th>
                    <th className="border-b border-gray-200 px-3 py-2 text-right text-xs font-semibold uppercase text-gray-500">Per Batch</th>
                    <th className="border-b border-gray-200 px-3 py-2 text-right text-xs font-semibold uppercase text-gray-500">Per Unit</th>
                    <th className="border-b border-gray-200 px-3 py-2 text-right text-xs font-semibold uppercase text-gray-500">% of Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {results.breakdown.map((row) => (
                    <tr key={row.label} className={row.label === "TOTAL" ? "bg-green-50 font-bold" : ""}>
                      <td className="border-b border-gray-100 px-3 py-2">{row.label}</td>
                      <td className="border-b border-gray-100 px-3 py-2 text-right font-semibold">{fmt(row.perBatch)}</td>
                      <td className="border-b border-gray-100 px-3 py-2 text-right font-semibold">{fmt(row.perUnit)}</td>
                      <td className="border-b border-gray-100 px-3 py-2 text-right font-semibold">{row.pct.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </form>

      <section className="mx-auto max-w-[900px] px-4 pb-8">
        <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-8">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-green-800">📖 How to Use This Calculator</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div><h3 className="mb-1 font-semibold text-green-800">1. Enter Product Details</h3><p className="text-sm text-gray-500">Name your product and specify how many units you produce per batch.</p></div>
            <div><h3 className="mb-1 font-semibold text-green-800">2. Add All Ingredients</h3><p className="text-sm text-gray-500">List every ingredient with quantities and costs. Don&apos;t forget seasonings and small items.</p></div>
            <div><h3 className="mb-1 font-semibold text-green-800">3. Include Labor Costs</h3><p className="text-sm text-gray-500">Track the time it takes to make a batch. Include prep, cooking, cooling, and packaging.</p></div>
            <div><h3 className="mb-1 font-semibold text-green-800">4. Set Your Overhead</h3><p className="text-sm text-gray-500">15-20% is typical for home-based. Commercial kitchens may be 25-35%.</p></div>
          </div>
        </div>
      </section>
      </>}

      <section className="py-10 text-center">
        <h2 className="mb-3 text-2xl font-bold text-green-800">Need Help With Your Food Business?</h2>
        <p className="mb-4 text-gray-500">Get custom inventory tracking, production logging, and cost analysis systems built for your business.</p>
        <a href="https://calendly.com/chiomaodo/intro-call" target="_blank" rel="noopener noreferrer" className="inline-block rounded-xl bg-orange-600 px-8 py-3 font-semibold text-white hover:bg-orange-700">
          Book a Free Consultation
        </a>
      </section>
    </div>
  );
}
