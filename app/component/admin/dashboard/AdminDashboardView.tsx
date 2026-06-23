"use client";

import { Sparkles, Activity, ShieldCheck } from "lucide-react";

export default function AdminDashboardView() {
  return (
    <div className="space-y-6 text-left animate-fadeIn">
      {/* View Header Block */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-[var(--primary)] tracking-wide">
          Operational Overview
        </h1>
        <p className="text-xs text-muted-fg font-light mt-0.5">
          Control monitoring console engine tracking system metrics.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            label: "Overall Active Sync Status",
            value: "Operational",
            icon: ShieldCheck,
            color: "text-emerald-600 bg-emerald-50 border-emerald-100",
          },
          {
            label: "Data Pipeline Stream Latency",
            value: "14ms",
            icon: Activity,
            color: "text-amber-600 bg-amber-50 border-amber-100",
          },
          {
            label: "Blog Engine Integration",
            value: "Ready to Mount",
            icon: Sparkles,
            color: "text-blue-600 bg-blue-50 border-blue-100",
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-brand border border-border/60 space-y-3 shadow-2xs hover:shadow-xs transition-shadow"
            >
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-fg">
                <span>{item.label}</span>
                <div className={`p-1.5 rounded-lg border ${item.color}`}>
                  <Icon size={14} className="stroke-[2]" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-fg-main tracking-tight">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actionable Blueprint Area */}
      <div className="p-8 bg-white border border-dashed border-border rounded-brand flex flex-col items-center justify-center text-center space-y-2 shadow-2xs">
        <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider">
          Ready for scaling
        </p>
        <p className="text-sm text-muted-fg font-light max-w-md leading-relaxed">
          The blog feature architecture is ready to scale. To implement it,
          mount matching schemas and layouts into your decoupled{" "}
          <code className="text-xs font-mono bg-muted-main px-1.5 py-0.5 rounded border border-border text-fg-main">
            /features/blogs
          </code>{" "}
          directory structure.
        </p>
      </div>
    </div>
  );
}