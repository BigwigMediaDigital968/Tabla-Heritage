"use client";

import { Sparkles, Activity, ShieldCheck } from "lucide-react";

export default function AdminDashboardView() {
  return (
    <div className="space-y-6 text-left animate-fadeIn">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
          Operational Overview
        </h1>
        <p className="text-xs text-neutral-400 font-light mt-0.5">
          Control monitoring console engine tracking metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            label: "Overall Active Sync Status",
            value: "Operational",
            icon: ShieldCheck,
            color: "text-emerald-400",
          },
          {
            label: "Data Pipeline Stream Latency",
            value: "14ms",
            icon: Activity,
            color: "text-amber-400",
          },
          {
            label: "Blog Engine Integration",
            value: "Ready to Mount",
            icon: Sparkles,
            color: "text-blue-400",
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-[#141312] p-5 rounded-2xl border border-neutral-800/80 space-y-1 shadow-md"
            >
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                <span>{item.label}</span>
                <Icon size={16} className={item.color} />
              </div>
              <p className="text-xl font-bold text-white tracking-wide pt-1">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="p-8 border border-dashed border-neutral-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          Ready for scaling
        </p>
        <p className="text-xs text-neutral-500 font-light max-w-sm leading-relaxed">
          The blog feature architecture is ready to scale. To implement it,
          mount matching schemas and layouts into your decoupled{" "}
          <code className="text-neutral-300 font-mono">/features/blogs</code>{" "}
          directory structure.
        </p>
      </div>
    </div>
  );
}
