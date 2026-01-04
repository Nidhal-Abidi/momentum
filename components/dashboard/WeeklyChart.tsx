import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { WeeklyData, DomainStat } from "@/lib/types/dashboard";

interface WeeklyChartProps {
  weeklyData: WeeklyData[];
  domainStats: DomainStat[];
}

const tailwindColorMap: Record<string, string> = {
  blue: "#3b82f6",
  purple: "#a855f7",
  green: "#22c55e",
  emerald: "#10b981",
  orange: "#f97316",
  red: "#ef4444",
  indigo: "#6366f1",
  lime: "#84cc16",
  pink: "#ec4899",
  cyan: "#06b6d4",
  amber: "#f59e0b",
};

export function WeeklyChart({ weeklyData, domainStats }: WeeklyChartProps) {
  // Create a mapping of domain names to colors
  const domainColors: Record<string, string> = {};
  domainStats.forEach((domain) => {
    domainColors[domain.name] =
      tailwindColorMap[domain.color] || tailwindColorMap.blue;
  });

  const domainNames = domainStats.map((d) => d.name);

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-1">
          Weekly Breakdown
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Compare completion patterns across all weeks this month
        </p>
      </div>

      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={weeklyData}
            margin={{ top: 20, right: 10, left: -20, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-stone-200 dark:text-stone-800"
              vertical={false}
            />
            <XAxis
              dataKey="week"
              stroke="currentColor"
              className="text-stone-600 dark:text-stone-400"
              tick={{ fontSize: 13, fontWeight: 500 }}
              tickLine={false}
              axisLine={{
                stroke: "currentColor",
                className: "text-stone-300 dark:text-stone-700",
              }}
            />
            <YAxis
              stroke="currentColor"
              className="text-stone-600 dark:text-stone-400"
              tick={{ fontSize: 13, fontWeight: 500 }}
              tickLine={false}
              axisLine={{
                stroke: "currentColor",
                className: "text-stone-300 dark:text-stone-700",
              }}
              domain={[0, 7]}
              ticks={[0, 1, 2, 3, 4, 5, 6, 7]}
              label={{
                value: "Days Completed",
                angle: -90,
                position: "insideLeft",
                style: {
                  fontSize: 13,
                  fontWeight: 500,
                  fill: "currentColor",
                },
                className: "text-stone-600 dark:text-stone-400",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgb(255 255 255 / 0.95)",
                border: "1px solid rgb(231 229 228)",
                borderRadius: "12px",
                padding: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              labelStyle={{
                fontWeight: 600,
                marginBottom: "8px",
                color: "#1c1917",
              }}
              itemStyle={{
                fontSize: "13px",
                padding: "2px 0",
              }}
              cursor={{ fill: "rgb(250 250 249 / 0.5)" }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
                fontSize: "13px",
                fontWeight: 500,
              }}
              iconType="circle"
              iconSize={10}
            />
            {domainNames.map((domainName) => (
              <Bar
                key={domainName}
                dataKey={domainName}
                fill={domainColors[domainName]}
                radius={[6, 6, 0, 0]}
                maxBarSize={60}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 p-4 bg-stone-50 dark:bg-stone-800/50 rounded-lg">
        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
          <span className="font-semibold">💡 Insight:</span> Look for patterns
          like consistent drops in Week 3 or strong starts that fade. Use this
          data to identify when you need extra motivation or which domains need
          attention.
        </p>
      </div>
    </div>
  );
}
