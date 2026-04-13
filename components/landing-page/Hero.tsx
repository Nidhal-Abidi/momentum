"use client";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { DomainCard } from "./DomainCard";
import Link from "next/link";
import { Button } from "../shadcn/button";

export const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto px-8 pt-32 pb-20 lg:pt-48 lg:pb-32 grid lg:grid-cols-2 gap-16 items-center">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-momentum-primary/10 text-momentum-primary text-sm font-bold tracking-wide uppercase">
          Progress over perfection
        </div>
        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] font-headline">
          Track Your <span className="text-momentum-primary">Life Domains</span>
          , Not Your To-Dos
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
          Most apps focus on the 47 tasks you have not finished. Momentum
          focuses on 4 areas of your life you are actually growing in.
        </p>
        <div className="flex flex-wrap items-center gap-6 pt-4">
          <Button size="lg" className="cursor-pointer  hero-gradient text-white rounded-full font-bold text-lg shadow-lg shadow-momentum-primary/20 hover:shadow-momentum-primary/40 transition-all active:scale-95 transform" asChild>
            <Link href="signup">Start Tracking Free</Link>
          </Button>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 text-slate-900 font-bold hover:text-momentum-primary transition-colors group"
          >
            See How It Works
            <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </motion.div>

      <div className="relative">
        <div className="relative w-full max-w-125 mx-auto rounded-3xl shadow-2xl shadow-blue-500/5 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />

          <div className="relative w-full h-full flex flex-col gap-4 justify-center">
            <DomainCard
              title="Career"
              progress="5/5 ✓"
              streak="12-WEEK STREAK"
              color="bg-momentum-primary"
              percent={100}
              delay={0.1}
              rotate={-2}
            />
            <DomainCard
              title="Health"
              progress="4/5"
              streak="8-WEEK STREAK"
              color="bg-momentum-secondary"
              percent={80}
              delay={0.2}
              rotate={3}
            />
            <DomainCard
              title="Learning"
              progress="3/5"
              streak="4-WEEK STREAK"
              color="bg-momentum-accent"
              percent={60}
              delay={0.3}
              rotate={-1}
            />
            <DomainCard
              title="Creative"
              progress="4/5"
              streak="15-WEEK STREAK"
              color="bg-momentum-tertiary"
              percent={80}
              delay={0.4}
              rotate={2}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
