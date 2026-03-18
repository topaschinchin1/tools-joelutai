"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const WEBHOOK_URL = "https://joelut.app.n8n.cloud/webhook/foodpro-chat";

const EXAMPLES: Record<string, string[]> = {
  restaurant: ["My grilled chicken dries out during dinner rush hold times", "What anti-inflammatory ingredients can I add to my menu?", "How do I make a creamy pasta sauce dairy-free?"],
  bakery: ["How can I make my muffins healthier without changing taste?", "My sourdough isn't getting the right crumb structure", "Best sugar substitute for diabetic-friendly pastries?"],
  manufacturer: ["My chin chin is absorbing too much oil during frying", "How do I extend shelf life without artificial preservatives?", "What functional ingredients can I add to snack products?"],
  caterer: ["How do I scale mac & cheese from 20 to 200 servings?", "Best way to keep food safe during outdoor events?", "Which dishes hold best for 3+ hour buffet service?"],
  food_truck: ["Quick anti-inflammatory taco toppings that wow customers?", "How to keep fried items crispy in a food truck setup?", "Cost-effective protein substitutes for my bowls?"],
  meal_prep: ["Which vegetables lose the most nutrients when reheated?", "Best containers to preserve freshness for 5-day preps?", "How to add functional superfoods to weekly meal plans?"],
};

const BIZ_OPTIONS = [
  { key: "restaurant", icon: "🍽️", label: "Restaurant" },
  { key: "bakery", icon: "🥐", label: "Bakery" },
  { key: "manufacturer", icon: "🏭", label: "Manufacturer" },
  { key: "caterer", icon: "🍱", label: "Caterer" },
  { key: "food_truck", icon: "🚚", label: "Food Truck" },
  { key: "meal_prep", icon: "🥗", label: "Meal Prep" },
];

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function FoodProPage() {
  const [step, setStep] = useState<"email" | "biz" | "chat">("email");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [bizType, setBizType] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showExamples, setShowExamples] = useState(true);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, loading]);

  function submitEmail() {
    if (!name.trim()) { setError("Please enter your name"); return; }
    if (!email.trim() || !email.includes("@")) { setError("Please enter a valid email"); return; }
    setError("");
    setStep("biz");
  }

  function selectBiz(type: string) {
    setBizType(type);
    const label = BIZ_OPTIONS.find((b) => b.key === type)?.label || type;
    setMessages([
      {
        role: "assistant",
        text: `Hey ${name}! 👋 Welcome to FoodPro AI.\n\nI see you run a ${label.toLowerCase()} — great! I'm here to help with recipe optimization, ingredient substitutions, cost analysis, and functional food insights.\n\nAsk me anything, or try one of the examples below!`,
      },
    ]);
    setStep("chat");
  }

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    setInput("");
    setShowExamples(false);
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: text,
          user_name: name,
          user_email: email,
          business_type: bizType,
          session_id: `web_${email}_${Date.now()}`,
          timestamp: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      const reply = data.output || data.response || data.text || "Sorry, I couldn't process that. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Connection error — please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0D1B0F]">
      <header className="flex items-center justify-between border-b border-[#1E3A22] px-6 py-4">
        <div className="text-xl font-bold text-white">
          JoeLuT<span className="text-blue-400">AI</span>
        </div>
        <Link href="/" className="text-sm text-white/70 hover:text-white">
          &larr; Back to Tools
        </Link>
      </header>

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col">
        {/* Email Step */}
        {step === "email" && (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
            <div className="w-full rounded-2xl border border-[#1E3A22] bg-[#0D1B0F] p-8">
              <div className="mb-4 text-center text-5xl">🧑‍🔬</div>
              <h2 className="mb-2 text-center text-xl font-bold text-white">Ask a Food Scientist</h2>
              <p className="mb-6 text-center text-sm text-gray-400">
                Get instant answers to your recipe questions, ingredient substitutions, and food science inquiries.
              </p>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-3 w-full rounded-xl border border-[#1E3A22] bg-[#132415] px-4 py-3 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitEmail()}
                className="mb-3 w-full rounded-xl border border-[#1E3A22] bg-[#132415] px-4 py-3 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"
              />
              {error && <p className="mb-3 text-center text-sm text-orange-500">{error}</p>}
              <button
                onClick={submitEmail}
                className="w-full rounded-xl bg-gradient-to-r from-blue-700 to-blue-500 py-3 font-bold text-white"
              >
                Start Chatting &rarr;
              </button>
              <p className="mt-4 text-center text-xs text-gray-600">
                Powered by <span className="font-semibold text-blue-500">JoeLuT AI</span>
              </p>
            </div>
          </div>
        )}

        {/* Business Type Step */}
        {step === "biz" && (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
            <div className="w-full">
              <h3 className="mb-2 text-center text-lg font-bold text-white">What best describes your business?</h3>
              <p className="mb-6 text-center text-sm text-gray-400">This helps me give you more relevant advice</p>
              <div className="grid grid-cols-2 gap-3">
                {BIZ_OPTIONS.map((biz) => (
                  <button
                    key={biz.key}
                    onClick={() => selectBiz(biz.key)}
                    className="rounded-xl border border-[#1E3A22] bg-[#132415] p-4 text-center transition hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-500/10"
                  >
                    <div className="mb-1 text-2xl">{biz.icon}</div>
                    <div className="text-sm font-semibold text-gray-300">{biz.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chat Step */}
        {step === "chat" && (
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Messages */}
            <div ref={messagesRef} className="flex-1 overflow-y-auto px-4 py-4">
              {messages.map((msg, i) => (
                <div key={i} className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed text-white ${
                      msg.role === "user"
                        ? "rounded-br-sm bg-gradient-to-r from-blue-700 to-blue-500"
                        : "rounded-bl-sm border border-[#1E3A22] bg-[#132415]"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="mb-3 flex justify-start">
                  <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-[#1E3A22] bg-[#132415] px-4 py-3">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:300ms]" />
                  </div>
                </div>
              )}
            </div>

            {/* Example prompts */}
            {showExamples && (
              <div className="px-4 pb-2">
                <p className="mb-2 text-xs text-gray-400">Try asking:</p>
                {(EXAMPLES[bizType] || EXAMPLES.restaurant).map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="mb-2 block w-full rounded-xl border border-[#1E3A22] px-4 py-3 text-left text-sm text-gray-300 transition hover:border-blue-500 hover:text-blue-400"
                  >
                    💬 {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-[#1E3A22] bg-[#0D1B0F] px-4 py-3">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(input);
                    }
                  }}
                  placeholder="Ask about your recipes..."
                  rows={1}
                  className="max-h-24 flex-1 resize-none rounded-xl border border-[#1E3A22] bg-[#132415] px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={() => sendMessage(input)}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${
                    input.trim() && !loading
                      ? "bg-gradient-to-r from-blue-700 to-blue-500 text-white"
                      : "bg-white/5 text-gray-500"
                  }`}
                >
                  ↑
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-gray-600">
                Powered by <span className="font-semibold text-blue-500">JoeLuT AI</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
