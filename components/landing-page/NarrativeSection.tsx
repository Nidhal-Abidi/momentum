"use client";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const gridItems = Array.from({ length: 12 * 7 }, () => {
  const rand = Math.random();
  if (rand > 0.7) return "bg-momentum-primary";
  if (rand > 0.5) return "bg-momentum-secondary";
  if (rand > 0.4) return "bg-momentum-tertiary";
  if (rand > 0.3) return "bg-momentum-accent";
  return "bg-slate-100";
});

export const NarrativeSection = () => {
  return (
    <section className="py-32 bg-surface" id="how-it-works">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid lg:grid-cols-[45%_55%] gap-16 items-center">
          <div className="space-y-12">
            <h2 className="text-5xl font-black text-slate-900 leading-[1.1] font-headline">
              Watching your narrative unfold.
            </h2>
            <div className="space-y-8">
              {[
                {
                  num: "01",
                  text: "Week 1: 2 days tracked",
                  color: "text-momentum-primary",
                },
                {
                  num: "06",
                  text: "Week 6: 4 days tracked",
                  color: "text-momentum-secondary",
                },
                {
                  num: "12",
                  text: "Week 12: 5 days tracked",
                  color: "text-momentum-tertiary",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <span
                    className={cn(
                      "text-3xl font-black font-headline",
                      item.color,
                    )}
                  >
                    {item.num}
                  </span>
                  <p className="text-xl font-bold text-slate-800">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-l-4 border-momentum-primary pl-6 py-2">
              <p className="text-xl italic text-slate-700 font-medium">
                I stopped feeling guilty about tasks. I started feeling proud of
                effort.
              </p>
              <p className="mt-2 text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">
                — SARAH, 12 WEEKS IN
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-6 max-w-md mx-auto lg:mx-0">
            <div className="grid grid-cols-7 gap-1.5">
              {gridItems.map((color, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.005 }}
                  className={cn("aspect-square rounded-md", color)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
