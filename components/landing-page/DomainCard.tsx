"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface DomainCardProps {
  title: string;
  progress: string;
  streak: string;
  color: string;
  percent: number;
  delay: number;
  rotate: number;
}

export const DomainCard = ({
  title,
  progress,
  streak,
  color,
  percent,
  delay,
  rotate,
}: DomainCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20, rotate }}
    animate={{ opacity: 1, y: 0, rotate }}
    whileHover={{ rotate: 0, scale: 1.02, zIndex: 50 }}
    transition={{ delay, duration: 0.5 }}
    className="w-[90%] bg-white/80 backdrop-blur-xl border border-white/40 p-5 rounded-2xl shadow-xl shadow-slate-200/50 relative overflow-hidden group cursor-default"
  >
    <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", color)} />
    <div className="pl-2">
      <div className="flex justify-between items-center mb-3">
        <span className="font-bold text-slate-800 text-lg uppercase tracking-tight font-headline">
          {title}
        </span>
        <span
          className={cn(
            "px-3 py-1 text-[10px] font-black rounded-full bg-opacity-10",
            color.replace("bg-", "text-"),
            color.replace("bg-", "bg-"),
          )}
        >
          {progress}
        </span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ delay: delay + 0.5, duration: 1 }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <span>🔥 {streak}</span>
      </div>
    </div>
  </motion.div>
);
