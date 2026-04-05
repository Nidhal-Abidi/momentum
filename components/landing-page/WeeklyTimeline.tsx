"use client";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export const WeeklyTimeline = () => {
  const days = [
    {
      name: "Monday",
      status: [true, true, false, true],
      label: "Started strong",
      color: "text-momentum-primary",
    },
    {
      name: "Tuesday",
      status: [true, true, true, true],
      label: "Perfect day",
      color: "text-slate-500",
    },
    {
      name: "Wednesday",
      status: [false, false, false, false],
      label: "Rest day",
      color: "text-slate-400",
      opacity: "opacity-60",
    },
    {
      name: "Thursday",
      status: [true, false, false, false],
      label: "Back on track",
      color: "text-momentum-secondary",
    },
    {
      name: "Friday",
      status: [true, true, true, false],
      label: "Finishing strong",
      color: "text-slate-500",
    },
    {
      name: "Saturday",
      status: [false, false, false, false],
      label: "Unplugged",
      color: "text-slate-400",
      opacity: "opacity-50",
    },
    {
      name: "Sunday",
      status: [true, false, false, false],
      label: "Weekly reset",
      color: "text-momentum-tertiary",
    },
  ];

  const colors = [
    "bg-momentum-primary",
    "bg-momentum-secondary",
    "bg-momentum-tertiary",
    "bg-momentum-accent",
  ];

  return (
    <section className="py-24 overflow-hidden bg-white" id="features">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 font-headline">
            A Week in Your Life
          </h2>
          <p className="text-slate-500">
            Simple tracking that builds rhythm, not anxiety.
          </p>
        </div>

        <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-8">
          {days.map((day, i) => (
            <motion.div
              key={day.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "min-w-[180px] bg-white p-6 rounded-3xl border border-slate-100 shadow-sm",
                day.opacity,
              )}
            >
              <p className="text-sm font-bold text-slate-500 mb-4 font-headline">
                {day.name}
              </p>
              <div className="space-y-3 mb-6">
                {day.status.map((active, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "size-8 rounded-full flex items-center justify-center transition-all duration-500",
                      active ? colors[idx] : "border-2 border-slate-100",
                    )}
                  >
                    {active && <Check className="size-4 text-white" />}
                  </div>
                ))}
              </div>
              <p
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider",
                  day.color,
                )}
              >
                {day.label}
              </p>
            </motion.div>
          ))}

          <div className="min-w-[280px] bg-momentum-primary flex flex-col items-center justify-center text-white p-8 rounded-3xl shadow-xl">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
              <Check className="size-8" />
            </div>
            <h4 className="text-xl font-bold mb-2 font-headline">
              5/7 days complete
            </h4>
            <p className="text-white/80 text-sm text-center">
              Goal achieved! 🎉
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
