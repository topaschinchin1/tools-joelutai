"use client";

import { useState, useMemo } from "react";

const CLIENTS = [
  { id: 1, brand: "Bayou Gold Sauces", contact: "Marcus W.", status: "in_production", step: 22, lastActivity: "2 hrs ago", paid: true, note: "500 bottles, hot fill" },
  { id: 2, brand: "Sweet Heat Texas", contact: "Dana P.", status: "waiting_payment", step: 11, lastActivity: "3 days ago", paid: false, note: "Waiting on lab fee ($500)" },
  { id: 3, brand: "Green Goddess Co.", contact: "Rachel M.", status: "active", step: 15, lastActivity: "1 day ago", paid: true, note: "Recipe approved, scheduling" },
  { id: 4, brand: "Mama Lucia's Kitchen", contact: "Tony R.", status: "stalled", step: 9, lastActivity: "12 days ago", paid: false, note: "No response since testing fee" },
  { id: 5, brand: "Lone Star Provisions", contact: "Jake H.", status: "complete", step: 25, lastActivity: "1 week ago", paid: true, note: "Delivered 2,000 units" },
  { id: 6, brand: "Fifth Ward Flavors", contact: "Keisha B.", status: "active", step: 7, lastActivity: "4 hrs ago", paid: true, note: "Recipe conversion in progress" },
  { id: 7, brand: "Island Spice Co.", contact: "Andre T.", status: "waiting_payment", step: 10, lastActivity: "5 days ago", paid: false, note: "SQF onboarding fee due" },
  { id: 8, brand: "Nana's Jams", contact: "Gloria S.", status: "active", step: 18, lastActivity: "6 hrs ago", paid: true, note: "Label proof review" },
  { id: 9, brand: "H-Town Hot Ones", contact: "Chris L.", status: "stalled", step: 4, lastActivity: "21 days ago", paid: false, note: "Ghosted after initial consult" },
  { id: 10, brand: "Sauce Boss HTX", contact: "Derek M.", status: "in_production", step: 23, lastActivity: "1 day ago", paid: true, note: "Bottling run tomorrow" },
  { id: 11, brand: "Tia Rosa's Kitchen", contact: "Maria G.", status: "new", step: 1, lastActivity: "Today", paid: false, note: "New inquiry, needs NDA" },
  { id: 12, brand: "Beasley & Beasley", contact: "Tom B.", status: "active", step: 14, lastActivity: "3 hrs ago", paid: true, note: "Spec sheet in review" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "In Progress", color: "#3B82F6", bg: "rgba(59,130,246,0.12)" },
  waiting_payment: { label: "Waiting on Payment", color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  stalled: { label: "Stalled", color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
  in_production: { label: "In Production", color: "#10B981", bg: "rgba(16,185,129,0.12)" },
  complete: { label: "Complete", color: "#6B7280", bg: "rgba(107,114,128,0.12)" },
  new: { label: "New", color: "#8B5CF6", bg: "rgba(139,92,246,0.12)" },
};

export default function CoPackDemo() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return CLIENTS.filter(c => {
      if (filter !== "all" && c.status !== filter) return false;
      if (search && !c.brand.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [filter, search]);

  const stats = {
    total: CLIENTS.length,
    active: CLIENTS.filter(c => c.status === "active").length,
    waiting: CLIENTS.filter(c => c.status === "waiting_payment").length,
    stalled: CLIENTS.filter(c => c.status === "stalled").length,
    production: CLIENTS.filter(c => c.status === "in_production").length,
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', -apple-system, sans-serif", background: "#0F172A", minHeight: "100vh", color: "#E2E8F0" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "#F59E0B", marginBottom: 4 }}>Co-Pack Client Manager</div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#F8FAFC", margin: 0 }}>Operations Dashboard</h1>
          </div>
          <div style={{ fontSize: 12, color: "#64748B" }}>
            Built by <span style={{ color: "#F59E0B" }}>JoeLuT AI</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 28 }}>
          {[
            { label: "Total Clients", value: stats.total, color: "#F8FAFC" },
            { label: "In Progress", value: stats.active, color: "#3B82F6" },
            { label: "Waiting Payment", value: stats.waiting, color: "#F59E0B" },
            { label: "Stalled", value: stats.stalled, color: "#EF4444" },
            { label: "In Production", value: stats.production, color: "#10B981" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#1E293B", borderRadius: 10, padding: "16px 14px", textAlign: "center", border: "1px solid #334155" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          {[
            { key: "all", label: "All" },
            { key: "active", label: "In Progress" },
            { key: "waiting_payment", label: "Waiting Payment" },
            { key: "stalled", label: "Stalled" },
            { key: "in_production", label: "In Production" },
            { key: "new", label: "New" },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              style={{
                padding: "6px 14px", fontSize: 12, borderRadius: 6, cursor: "pointer",
                background: filter === f.key ? "#F59E0B" : "#1E293B",
                color: filter === f.key ? "#0F172A" : "#94A3B8",
                border: `1px solid ${filter === f.key ? "#F59E0B" : "#334155"}`,
                fontWeight: filter === f.key ? 600 : 400,
              }}>
              {f.label}
            </button>
          ))}
          <input type="text" placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ marginLeft: "auto", padding: "6px 14px", fontSize: 12, background: "#1E293B", border: "1px solid #334155", borderRadius: 6, color: "#E2E8F0", outline: "none", width: 180 }} />
        </div>

        <div style={{ background: "#1E293B", borderRadius: 12, border: "1px solid #334155", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #334155" }}>
                {["Client", "Contact", "Step", "Status", "Last Activity", "Paid", "Notes"].map((h, i) => (
                  <th key={i} style={{ padding: "12px 14px", textAlign: "left", color: "#64748B", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const s = STATUS_CONFIG[c.status];
                return (
                  <tr key={c.id} style={{ borderBottom: "1px solid #334155", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 600, color: "#F8FAFC" }}>{c.brand}</td>
                    <td style={{ padding: "12px 14px", color: "#94A3B8" }}>{c.contact}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 60, height: 6, background: "#0F172A", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${(c.step / 25) * 100}%`, height: "100%", background: s.color, borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 11, color: "#64748B" }}>{c.step}/25</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, color: s.color, background: s.bg }}>{s.label}</span>
                    </td>
                    <td style={{ padding: "12px 14px", color: "#94A3B8", fontSize: 12 }}>{c.lastActivity}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ color: c.paid ? "#10B981" : "#EF4444", fontSize: 14 }}>{c.paid ? "\u2713" : "\u2717"}</span>
                    </td>
                    <td style={{ padding: "12px 14px", color: "#64748B", fontSize: 12, maxWidth: 200 }}>{c.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ textAlign: "center", marginTop: 32, padding: "16px 0", borderTop: "1px solid #334155" }}>
          <div style={{ fontSize: 11, color: "#475569" }}>
            <span style={{ color: "#F59E0B", fontWeight: 600 }}>JoeLuT AI</span> &middot; Co-Pack Operations Intelligence
          </div>
          <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>
            joelutai.com &middot; (832) 740-8716 &middot; Chioma Odo, PhD
          </div>
        </div>
      </div>
    </div>
  );
}
