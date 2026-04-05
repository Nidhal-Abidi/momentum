"use client";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { label: "Meditation", color: "bg-momentum-primary" },
  { label: "Exercising", color: "bg-momentum-secondary" },
  { label: "Learning", color: "bg-momentum-tertiary" },
  { label: "Creative", color: "bg-momentum-accent" },
];

const dayPatterns: Record<number, number[]> = {
  2: [1, 4],
  3: [1, 3, 5],
  4: [0, 2, 4, 6],
  5: [0, 1, 3, 5, 6],
};

// Each week: days count + per active-day-index → which category indices appear
const weekDefinitions: {
  days: number;
  cats: Record<number, number[]>;
}[] = [
  { days: 2, cats: { 0: [0], 1: [0] } },
  { days: 2, cats: { 0: [0, 2], 1: [0] } },
  { days: 3, cats: { 0: [1], 1: [0, 1], 2: [1] } },
  { days: 3, cats: { 0: [0, 1], 1: [1], 2: [0, 1, 3] } },
  { days: 3, cats: { 0: [1, 2], 1: [2], 2: [1, 2] } },
  { days: 4, cats: { 0: [0], 1: [0, 1, 2], 2: [1], 3: [0, 3] } },
  { days: 4, cats: { 0: [0, 2], 1: [1, 3], 2: [0, 1], 3: [2] } },
  {
    days: 5,
    cats: { 0: [0, 1], 1: [1, 2], 2: [0, 1, 2], 3: [2, 3], 4: [0, 1, 2, 3] },
  },
];

type DayData = { categories: number[] } | null;

const gridItems: DayData[] = weekDefinitions.flatMap(({ days, cats }) => {
  const activeDayPositions = dayPatterns[days] ?? [];
  const activeSet = new Set(activeDayPositions);

  return Array.from({ length: 7 }, (_, d) => {
    if (!activeSet.has(d)) return null;
    const activeIdx = activeDayPositions.indexOf(d);
    return { categories: cats[activeIdx] ?? [0] };
  });
});

export const NarrativeSection = () => {
  return (
    <section className="py-32 bg-surface" id="how-it-works">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid lg:grid-cols-[45%_55%] gap-16 items-center">
          <div className="space-y-12">
            <h2 className="text-5xl font-black text-slate-900 leading-[1.1] font-headline">
              See your{" "}
              <span className="text-momentum-primary italic">Momentum</span>{" "}
              take shape.
            </h2>
            <div className="space-y-8">
              {[
                {
                  num: "01",
                  text: "Week 1: 2 days tracked",
                  color: "text-momentum-primary",
                },
                {
                  num: "04",
                  text: "Week 4: 3 days tracked",
                  color: "text-momentum-secondary",
                },
                {
                  num: "08",
                  text: "Week 8: 5 days tracked",
                  color: "text-momentum-tertiary",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
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
                — Nidhal, 12 WEEKS IN
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-6 max-w-md mx-auto lg:mx-0">
            <div className="flex flex-wrap gap-3 mb-4">
              {CATEGORIES.map((cat) => (
                <div key={cat.label} className="flex items-center gap-1.5">
                  <div className={cn("w-2.5 h-2.5 rounded-sm", cat.color)} />
                  <span className="text-xs text-slate-500">{cat.label}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {gridItems.map((day, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.005 }}
                  className="aspect-square rounded-md overflow-hidden flex flex-col"
                >
                  {day === null ? (
                    <div className="flex-1 bg-slate-100" />
                  ) : (
                    day.categories.map((catIdx) => (
                      <div
                        key={catIdx}
                        className={cn(
                          "flex-1 w-full",
                          CATEGORIES[catIdx].color,
                        )}
                      />
                    ))
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
