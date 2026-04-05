"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const DailyQuestion = () => {
  const [domain, setDomain] = useState("health");
  const domains = ["health", "career", "learning", "creative"];

  useEffect(() => {
    const interval = setInterval(() => {
      setDomain((prev) => {
        const idx = domains.indexOf(prev);
        return domains[(idx + 1) % domains.length];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-32 bg-[rgb(24,28,31)] text-white flex items-center justify-center text-center">
      <div className="max-w-4xl px-8">
        <h2 className="text-4xl lg:text-7xl font-black mb-12 tracking-tighter leading-none font-headline">
          Did you work on your <br />
          <span
            className={cn(
              "transition-all duration-500",
              domain === "health" && "text-momentum-secondary",
              domain === "career" && "text-momentum-primary",
              domain === "learning" && "text-momentum-tertiary",
              domain === "creative" && "text-momentum-accent",
            )}
          >
            {domain}
          </span>{" "}
          today?
        </h2>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button className="px-16 py-8 bg-white text-slate-900 font-black text-3xl rounded-2xl hover:bg-momentum-secondary hover:text-white transition-all transform hover:scale-105 active:scale-95 font-headline">
            YES
          </button>
          <button className="px-16 py-8 border-4 border-white/20 text-white font-black text-3xl rounded-2xl hover:bg-red-600 hover:border-red-600 transition-all transform hover:scale-105 active:scale-95 font-headline">
            NOT TODAY
          </button>
        </div>
        <p className="mt-12 text-white/40 font-medium text-lg italic">
          That&apos;s it. No timers, no guilt, no complexity.
        </p>
      </div>
    </section>
  );
};
