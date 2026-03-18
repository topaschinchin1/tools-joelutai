"use client";

import Link from "next/link";
import { useState } from "react";

const LEAD_WEBHOOK_URL = "https://joelut.app.n8n.cloud/webhook/landing-page-leads";

type Answers = Record<string, string>;

interface Detail {
  icon: "check" | "x" | "warn";
  text: string;
}

interface ResultData {
  status: "exempt" | "partial" | "required";
  title: string;
  summary: string;
  details: Detail[];
  actions: string[];
}

const questions = [
  {
    key: "business",
    text: "1. What type of food business do you operate?",
    options: [
      { value: "manufacturer", label: "Food Manufacturer / Processor" },
      { value: "distributor", label: "Distributor / Wholesaler" },
      { value: "retailer", label: "Retailer / Grocery Store" },
      { value: "restaurant", label: "Restaurant / Food Service" },
    ],
  },
  {
    key: "ftl",
    text: "2. Do you handle any foods on the FDA Food Traceability List (FTL)?",
    help: "FTL includes: leafy greens, melons, tomatoes, soft cheeses, shell eggs, nut butters, fresh herbs, tropical fruits, finfish, crustaceans, mollusks, ready-to-eat deli salads",
    options: [
      { value: "yes", label: "Yes, we handle FTL foods" },
      { value: "no", label: "No, none of these foods" },
      { value: "unsure", label: "I'm not sure" },
    ],
  },
  {
    key: "revenue",
    text: "3. What is your annual food sales revenue?",
    options: [
      { value: "under1m", label: "Under $1 million" },
      { value: "1to10m", label: "$1 million - $10 million" },
      { value: "over10m", label: "Over $10 million" },
    ],
  },
  {
    key: "sales",
    text: "4. How do you primarily sell your products?",
    options: [
      { value: "direct", label: "Direct to consumers only (farmers market, own store)" },
      { value: "wholesale", label: "Wholesale to retailers/distributors" },
      { value: "both", label: "Both direct and wholesale" },
    ],
  },
  {
    key: "lotTracking",
    text: "5. Do you currently track lot/batch numbers for your products?",
    options: [
      { value: "yes", label: "Yes, we have lot/batch tracking" },
      { value: "partial", label: "Partially - some products only" },
      { value: "no", label: "No lot tracking currently" },
    ],
  },
  {
    key: "traceability",
    text: "6. Can you trace a product back to its source within 24 hours?",
    options: [
      { value: "yes", label: "Yes, we can trace within 24 hours" },
      { value: "no", label: "No, it would take longer" },
      { value: "unsure", label: "Not sure / Haven't tested" },
    ],
  },
];

function checkCompliance(answers: Answers): ResultData {
  const { business, ftl, revenue, sales, lotTracking, traceability } = answers;

  if (business === "restaurant") {
    return {
      status: "exempt",
      title: "Likely Exempt",
      summary: "Restaurants and food service establishments are generally exempt from FSMA 204 recordkeeping requirements for foods prepared and sold directly to consumers.",
      details: [
        { icon: "check", text: "Food service establishments are exempt for foods prepared on-site" },
        { icon: "warn", text: "Exemption applies only to foods sold directly to consumers" },
        { icon: "warn", text: "If you distribute to other businesses, those products may be covered" },
      ],
      actions: ["Maintain your current food safety records", "If you wholesale any products, assess those separately", "Stay informed about any regulatory updates"],
    };
  }

  if (ftl === "no") {
    return {
      status: "exempt",
      title: "Likely Exempt",
      summary: "If you don't handle any foods on the Food Traceability List (FTL), you're not subject to the additional FSMA 204 recordkeeping requirements.",
      details: [
        { icon: "check", text: "Your products are not on the Food Traceability List" },
        { icon: "warn", text: "Standard food safety records still required" },
        { icon: "warn", text: "Review the FTL periodically as it may be updated" },
      ],
      actions: ["Verify your products against the official FTL list", "Maintain standard food safety documentation", "Monitor FDA updates for any FTL changes"],
    };
  }

  if (revenue === "under1m" && sales === "direct") {
    return {
      status: "partial",
      title: "Partial Exemption May Apply",
      summary: "Small businesses under $1M in annual sales that sell directly to consumers may qualify for exemptions, but should verify specific requirements.",
      details: [
        { icon: "check", text: "Small business size may qualify for exemptions" },
        { icon: "check", text: "Direct-to-consumer sales have reduced requirements" },
        { icon: "warn", text: "Must verify you meet all exemption criteria" },
        { icon: "warn", text: "Some recordkeeping may still be required" },
      ],
      actions: ["Review FDA small business exemption criteria", "Document your sales channels and revenue", "Implement basic lot tracking as best practice", "Consult with a food safety expert to confirm status"],
    };
  }

  if (ftl === "unsure") {
    return {
      status: "partial",
      title: "Assessment Needed",
      summary: "You need to determine if your products are on the Food Traceability List. This is the key factor for FSMA 204 compliance.",
      details: [
        { icon: "warn", text: "FTL status unknown - this is critical to determine" },
        { icon: "x", text: "Cannot confirm compliance status without FTL assessment" },
      ],
      actions: ["Review the FDA Food Traceability List immediately", "Inventory all products you manufacture, process, or handle", "Compare your products against each FTL category", "Consider consulting a food safety professional"],
    };
  }

  const details: Detail[] = [
    { icon: "x", text: "You handle foods on the Food Traceability List" },
    { icon: business === "manufacturer" ? "x" : "warn", text: `Business type: ${business} - covered under FSMA 204` },
  ];

  if (revenue !== "under1m") details.push({ icon: "x", text: "Revenue above small business exemption threshold" });
  if (sales !== "direct") details.push({ icon: "x", text: "Wholesale/distribution sales are covered" });

  if (lotTracking === "no") details.push({ icon: "x", text: "No lot tracking system - REQUIRED for compliance" });
  else if (lotTracking === "partial") details.push({ icon: "warn", text: "Partial lot tracking - needs expansion to all FTL products" });
  else details.push({ icon: "check", text: "Lot tracking in place - good foundation" });

  if (traceability !== "yes") details.push({ icon: "x", text: "24-hour traceability not confirmed - REQUIRED" });
  else details.push({ icon: "check", text: "24-hour traceability capability confirmed" });

  return {
    status: "required",
    title: "Compliance Required",
    summary: "Based on your answers, your business is likely subject to FSMA 204 requirements. You must be compliant by January 20, 2026.",
    details,
    actions: [
      "Implement Traceability Lot Codes (TLCs) for all FTL products",
      "Set up systems to record Key Data Elements (KDEs)",
      "Document all Critical Tracking Events (CTEs)",
      "Establish 24-hour trace-back capability",
      "Train staff on new recordkeeping requirements",
      "Test your system with a mock recall exercise",
      "Consider AI-powered traceability software",
    ],
  };
}

const iconMap = { check: "✓", x: "✗", warn: "⚡" };
const iconClass = { check: "text-green-700", x: "text-red-600", warn: "text-amber-600" };
const statusIcon = { exempt: "✅", partial: "🔶", required: "⚠️" };
const statusBg = { exempt: "from-green-100 to-green-200", partial: "from-amber-100 to-amber-200", required: "from-red-100 to-red-200" };
const statusTextColor = { exempt: "text-green-800", partial: "text-amber-700", required: "text-red-700" };

export default function FSMAPage() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [gateError, setGateError] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<ResultData | null>(null);

  const allAnswered = questions.every((q) => answers[q.key]);

  async function submitGate() {
    if (!userName.trim()) { setGateError("Please enter your name"); return; }
    if (!userEmail.trim() || !userEmail.includes("@")) { setGateError("Please enter a valid email"); return; }
    setGateError("");

    try {
      fetch(LEAD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName.trim(),
          email: userEmail.trim(),
          tool: "FSMA 204 Compliance Checker",
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});
    } catch {
      // Don't block user if webhook fails
    }

    setUnlocked(true);
  }

  function select(key: string, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function submit() {
    if (!allAnswered) return;
    setResult(checkCompliance(answers));
  }

  function restart() {
    setAnswers({});
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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

      <div className="bg-gradient-to-r from-red-600 to-orange-600 py-3 text-center font-semibold text-white">
        ⏰ FSMA 204 Compliance Deadline:{" "}
        <span className="ml-2 rounded bg-white/20 px-3 py-1">January 20, 2026</span>
      </div>

      <section className="py-10 text-center">
        <span className="mb-3 inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
          Free Compliance Check
        </span>
        <h1 className="mb-2 text-4xl font-bold text-green-800">FSMA 204 Compliance Checker</h1>
        <p className="mx-auto max-w-xl text-gray-500">
          Find out if your food business needs to comply with the FDA Food Traceability Rule in under 2 minutes.
        </p>
      </section>

      {/* Email Gate */}
      {!unlocked && (
        <div className="mx-auto max-w-md px-4 pb-16">
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <div className="mb-4 text-center text-5xl">📋</div>
            <h2 className="mb-2 text-center text-xl font-bold text-green-800">Check Your Compliance for Free</h2>
            <p className="mb-6 text-center text-sm text-gray-500">
              Enter your name and email to access the compliance checker. We will send you a detailed report based on your results.
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
              Start Assessment &rarr;
            </button>
            <p className="mt-4 text-center text-xs text-gray-400">
              Powered by <span className="font-semibold text-green-700">JoeLuT AI</span>
            </p>
          </div>
        </div>
      )}

      {unlocked && <><div className="mx-auto max-w-[700px] px-4 pb-12">
        {!result ? (
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-green-800">
              📋 Quick Assessment
            </h2>

            {questions.map((q) => (
              <div key={q.key} className="mb-8 last:mb-0">
                <div className="mb-3 text-lg font-semibold">{q.text}</div>
                {q.help && <p className="mb-3 text-sm italic text-gray-500">{q.help}</p>}
                <div className="flex flex-col gap-3">
                  {q.options.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => select(q.key, opt.value)}
                      className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition ${
                        answers[q.key] === opt.value
                          ? "border-green-800 bg-green-100"
                          : "border-gray-200 hover:border-green-800 hover:bg-green-50"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          answers[q.key] === opt.value ? "border-green-800 bg-green-800" : "border-gray-300"
                        }`}
                      >
                        {answers[q.key] === opt.value && <span className="h-2 w-2 rounded-full bg-white" />}
                      </span>
                      <span className="font-medium">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={submit}
              disabled={!allAnswered}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-green-800 to-green-600 px-8 py-4 text-lg font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-400 disabled:shadow-none disabled:hover:translate-y-0"
            >
              Check My Compliance Status
            </button>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <div className={`mb-6 rounded-xl bg-gradient-to-br ${statusBg[result.status]} p-8 text-center`}>
              <div className="mb-3 text-5xl">{statusIcon[result.status]}</div>
              <h2 className={`mb-2 text-2xl font-bold ${statusTextColor[result.status]}`}>{result.title}</h2>
              <p className="text-gray-600">{result.summary}</p>
            </div>

            <div className="mb-6">
              <h3 className="mb-4 text-lg font-semibold text-green-800">📊 Your Assessment Details</h3>
              <ul className="divide-y divide-gray-100">
                {result.details.map((d, i) => (
                  <li key={i} className="flex items-start gap-3 py-3">
                    <span className={`font-bold ${iconClass[d.icon]}`}>{iconMap[d.icon]}</span>
                    <span>{d.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6 rounded-xl border-2 border-green-200 bg-green-50 p-6">
              <h3 className="mb-3 font-semibold text-green-800">📋 Recommended Next Steps</h3>
              <ul className="ml-6 list-disc space-y-2 text-gray-600">
                {result.actions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>

            <div className="mb-6 rounded-xl bg-gradient-to-r from-green-800 to-green-600 p-6 text-center text-white">
              <h3 className="mb-1 text-lg font-bold">📧 Get Your Full Compliance Report</h3>
              <p className="mb-4 text-sm text-white/90">
                Receive a detailed PDF report with specific requirements for your business type.
              </p>
              <div className="mx-auto flex max-w-sm gap-2 max-sm:flex-col">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-lg px-4 py-3 text-gray-800 focus:outline-none"
                />
                <button className="rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700">
                  Send Report
                </button>
              </div>
            </div>

            <button onClick={restart} className="w-full rounded-lg bg-gray-100 py-3 font-semibold text-gray-600 hover:bg-gray-200">
              ↻ Start Over
            </button>
          </div>
        )}
      </div>

      <div className="mx-auto max-w-[700px] px-4 pb-8">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-xl font-semibold text-green-800">📚 About FSMA 204</h2>
          <div className="mb-6 space-y-4">
            <div>
              <h3 className="mb-1 font-semibold">What is FSMA 204?</h3>
              <p className="text-sm leading-relaxed text-gray-500">The FDA Food Traceability Rule (FSMA 204) requires additional traceability recordkeeping for businesses that manufacture, process, pack, or hold foods on the Food Traceability List (FTL).</p>
            </div>
            <div>
              <h3 className="mb-1 font-semibold">Key Requirements</h3>
              <p className="text-sm leading-relaxed text-gray-500">Covered businesses must maintain records with Key Data Elements (KDEs) for Critical Tracking Events (CTEs), assign Traceability Lot Codes (TLCs), and provide information to FDA within 24 hours.</p>
            </div>
            <div>
              <h3 className="mb-1 font-semibold">Who is Exempt?</h3>
              <p className="text-sm leading-relaxed text-gray-500">Restaurants, farms (for produce they grow), and small businesses under certain revenue thresholds may be exempt from some or all requirements.</p>
            </div>
          </div>
          <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-6">
            <h3 className="mb-3 font-semibold text-amber-700">🍎 Foods on the Traceability List (FTL)</h3>
            <ul className="ml-6 list-disc space-y-1 text-sm text-gray-600">
              <li><strong>Produce:</strong> Leafy greens, tomatoes, melons, sprouts, peppers, fresh herbs, tropical tree fruits</li>
              <li><strong>Dairy:</strong> Soft cheeses, shell eggs</li>
              <li><strong>Seafood:</strong> Finfish, crustaceans, mollusks (fresh/frozen)</li>
              <li><strong>Prepared Foods:</strong> Nut butters, ready-to-eat deli salads</li>
            </ul>
          </div>
        </div>
      </div></>}

      <section className="py-10 text-center">
        <h2 className="mb-3 text-2xl font-bold text-green-800">Need Help with FSMA Compliance?</h2>
        <p className="mb-4 text-gray-500">We build AI-powered traceability systems that make compliance easy.</p>
        <a href="https://calendly.com/chiomaodo/intro-call" target="_blank" rel="noopener noreferrer" className="inline-block rounded-xl bg-orange-600 px-8 py-3 font-semibold text-white hover:bg-orange-700">
          Book a Free Consultation
        </a>
      </section>

      <footer className="py-6 text-center text-sm text-gray-400">
        <p>Disclaimer: This tool provides general guidance only and does not constitute legal advice.</p>
      </footer>
    </div>
  );
}
