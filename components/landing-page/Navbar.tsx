"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/70 backdrop-blur-xl shadow-sm py-4"
          : "bg-transparent py-6",
      )}
    >
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-tighter text-slate-900 font-headline">
            Momentum
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button className="font-headline font-semibold text-sm tracking-wide text-momentum-primary hover:opacity-80 transition-all active:scale-95">
            <Link href="/signup">Sign Up</Link>
          </button>
        </div>
      </div>
    </nav>
  );
};
