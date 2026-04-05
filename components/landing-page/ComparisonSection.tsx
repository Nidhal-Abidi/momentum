import { cn } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  Briefcase,
  Eye,
  GraduationCap,
  Palette,
} from "lucide-react";

export const ComparisonSection = () => {
  return (
    <section className="min-h-screen flex flex-col lg:flex-row overflow-hidden border-y border-slate-100">
      <div className="lg:w-1/2 bg-[#fff0f0] p-12 lg:p-24 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <h3 className="text-3xl font-black text-red-600 mb-8 flex items-center gap-3 font-headline">
            <AlertTriangle className="w-8 h-8" />
            Drowning in tasks
          </h3>
          <div className="space-y-3 opacity-80">
            {[
              { text: "Answer emails", status: "OVERDUE", strike: true },
              { text: "Buy milk", status: "OVERDUE" },
              {
                text: "Submit Q3 report draft",
                status: "URGENT",
                blur: "blur-[1px]",
              },
              { text: "Call landlord", status: "TODAY", blur: "blur-[2px]" },
            ].map((task, i) => (
              <div
                key={i}
                className={cn(
                  "p-4 bg-white border-l-4 border-red-500 shadow-sm rounded-r-lg flex justify-between items-center",
                  task.blur,
                )}
              >
                <span
                  className={cn(
                    "text-sm font-bold",
                    task.strike && "line-through text-slate-400",
                  )}
                >
                  {task.text}
                </span>
                <span className="text-[10px] text-red-600 font-bold px-2 py-0.5 bg-red-50 rounded-full">
                  {task.status}
                </span>
              </div>
            ))}
            <div className="text-center pt-8">
              <p className="text-red-600 font-black text-6xl font-headline">
                47
              </p>
              <p className="text-red-600/60 text-xs font-bold uppercase tracking-widest">
                Tasks remaining
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:w-1/2 bg-white p-12 lg:p-24 flex flex-col justify-center border-l border-slate-100">
        <div className="max-w-md mx-auto w-full">
          <h3 className="text-3xl font-black text-momentum-primary mb-8 flex items-center gap-3 font-headline">
            <Eye className="size-8" />
            Focused on what matters
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Briefcase, title: "Career", dots: 2, color: "primary" },
              { icon: Activity, title: "Health", dots: 1, color: "secondary" },
              {
                icon: GraduationCap,
                title: "Learning",
                dots: 3,
                color: "tertiary",
              },
              { icon: Palette, title: "Creative", dots: 1, color: "accent" },
            ].map((domain, i) => {
              const Icon = domain.icon;
              const colorClass = `momentum-${domain.color}`;
              return (
                <div
                  key={i}
                  className={cn(
                    "p-6 rounded-3xl border transition-all hover:shadow-md",
                    `bg-${colorClass}/5 border-${colorClass}/10`,
                  )}
                >
                  <div
                    className={cn(
                      "size-10 rounded-full flex items-center justify-center mb-4",
                      `bg-${colorClass}/20 text-${colorClass}`,
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <p className="font-bold text-slate-900 font-headline">
                    {domain.title}
                  </p>
                  <div className="flex gap-1 mt-2">
                    {[...Array(3)].map((_, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "size-1.5 rounded-full",
                          idx < domain.dots
                            ? `bg-${colorClass}`
                            : "bg-slate-200",
                        )}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
