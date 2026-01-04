// Color utility functions for Goals & Streaks components
// Maps domain color names to actual Tailwind classes

export const getColorClasses = (color: string) => {
  const colorMap: Record<string, {
    bg: string;
    bgLight: string;
    bgDark: string;
    text: string;
    textLight: string;
    border: string;
    borderLight: string;
    hover: string;
    shadow: string;
    gradient: string;
  }> = {
    indigo: {
      bg: "bg-indigo-500",
      bgLight: "bg-indigo-100 dark:bg-indigo-900/30",
      bgDark: "bg-indigo-600 dark:bg-indigo-400",
      text: "text-indigo-600 dark:text-indigo-400",
      textLight: "text-indigo-700 dark:text-indigo-400",
      border: "border-indigo-400 dark:border-indigo-500",
      borderLight: "border-indigo-200 dark:border-indigo-800",
      hover: "hover:bg-indigo-600",
      shadow: "shadow-indigo-100 dark:shadow-indigo-900/20",
      gradient: "from-indigo-500 to-indigo-600",
    },
    emerald: {
      bg: "bg-emerald-500",
      bgLight: "bg-emerald-100 dark:bg-emerald-900/30",
      bgDark: "bg-emerald-600 dark:bg-emerald-400",
      text: "text-emerald-600 dark:text-emerald-400",
      textLight: "text-emerald-700 dark:text-emerald-400",
      border: "border-emerald-400 dark:border-emerald-500",
      borderLight: "border-emerald-200 dark:border-emerald-800",
      hover: "hover:bg-emerald-600",
      shadow: "shadow-emerald-100 dark:shadow-emerald-900/20",
      gradient: "from-emerald-500 to-emerald-600",
    },
    violet: {
      bg: "bg-violet-500",
      bgLight: "bg-violet-100 dark:bg-violet-900/30",
      bgDark: "bg-violet-600 dark:bg-violet-400",
      text: "text-violet-600 dark:text-violet-400",
      textLight: "text-violet-700 dark:text-violet-400",
      border: "border-violet-400 dark:border-violet-500",
      borderLight: "border-violet-200 dark:border-violet-800",
      hover: "hover:bg-violet-600",
      shadow: "shadow-violet-100 dark:shadow-violet-900/20",
      gradient: "from-violet-500 to-violet-600",
    },
    sky: {
      bg: "bg-sky-500",
      bgLight: "bg-sky-100 dark:bg-sky-900/30",
      bgDark: "bg-sky-600 dark:bg-sky-400",
      text: "text-sky-600 dark:text-sky-400",
      textLight: "text-sky-700 dark:text-sky-400",
      border: "border-sky-400 dark:border-sky-500",
      borderLight: "border-sky-200 dark:border-sky-800",
      hover: "hover:bg-sky-600",
      shadow: "shadow-sky-100 dark:shadow-sky-900/20",
      gradient: "from-sky-500 to-sky-600",
    },
    amber: {
      bg: "bg-amber-500",
      bgLight: "bg-amber-100 dark:bg-amber-900/30",
      bgDark: "bg-amber-600 dark:bg-amber-400",
      text: "text-amber-600 dark:text-amber-400",
      textLight: "text-amber-700 dark:text-amber-400",
      border: "border-amber-400 dark:border-amber-500",
      borderLight: "border-amber-200 dark:border-amber-800",
      hover: "hover:bg-amber-600",
      shadow: "shadow-amber-100 dark:shadow-amber-900/20",
      gradient: "from-amber-500 to-amber-600",
    },
    rose: {
      bg: "bg-rose-500",
      bgLight: "bg-rose-100 dark:bg-rose-900/30",
      bgDark: "bg-rose-600 dark:bg-rose-400",
      text: "text-rose-600 dark:text-rose-400",
      textLight: "text-rose-700 dark:text-rose-400",
      border: "border-rose-400 dark:border-rose-500",
      borderLight: "border-rose-200 dark:border-rose-800",
      hover: "hover:bg-rose-600",
      shadow: "shadow-rose-100 dark:shadow-rose-900/20",
      gradient: "from-rose-500 to-rose-600",
    },
    blue: {
      bg: "bg-blue-500",
      bgLight: "bg-blue-100 dark:bg-blue-900/30",
      bgDark: "bg-blue-600 dark:bg-blue-400",
      text: "text-blue-600 dark:text-blue-400",
      textLight: "text-blue-700 dark:text-blue-400",
      border: "border-blue-400 dark:border-blue-500",
      borderLight: "border-blue-200 dark:border-blue-800",
      hover: "hover:bg-blue-600",
      shadow: "shadow-blue-100 dark:shadow-blue-900/20",
      gradient: "from-blue-500 to-blue-600",
    },
    teal: {
      bg: "bg-teal-500",
      bgLight: "bg-teal-100 dark:bg-teal-900/30",
      bgDark: "bg-teal-600 dark:bg-teal-400",
      text: "text-teal-600 dark:text-teal-400",
      textLight: "text-teal-700 dark:text-teal-400",
      border: "border-teal-400 dark:border-teal-500",
      borderLight: "border-teal-200 dark:border-teal-800",
      hover: "hover:bg-teal-600",
      shadow: "shadow-teal-100 dark:shadow-teal-900/20",
      gradient: "from-teal-500 to-teal-600",
    },
    purple: {
      bg: "bg-purple-500",
      bgLight: "bg-purple-100 dark:bg-purple-900/30",
      bgDark: "bg-purple-600 dark:bg-purple-400",
      text: "text-purple-600 dark:text-purple-400",
      textLight: "text-purple-700 dark:text-purple-400",
      border: "border-purple-400 dark:border-purple-500",
      borderLight: "border-purple-200 dark:border-purple-800",
      hover: "hover:bg-purple-600",
      shadow: "shadow-purple-100 dark:shadow-purple-900/20",
      gradient: "from-purple-500 to-purple-600",
    },
    pink: {
      bg: "bg-pink-500",
      bgLight: "bg-pink-100 dark:bg-pink-900/30",
      bgDark: "bg-pink-600 dark:bg-pink-400",
      text: "text-pink-600 dark:text-pink-400",
      textLight: "text-pink-700 dark:text-pink-400",
      border: "border-pink-400 dark:border-pink-500",
      borderLight: "border-pink-200 dark:border-pink-800",
      hover: "hover:bg-pink-600",
      shadow: "shadow-pink-100 dark:shadow-pink-900/20",
      gradient: "from-pink-500 to-pink-600",
    },
    orange: {
      bg: "bg-orange-500",
      bgLight: "bg-orange-100 dark:bg-orange-900/30",
      bgDark: "bg-orange-600 dark:bg-orange-400",
      text: "text-orange-600 dark:text-orange-400",
      textLight: "text-orange-700 dark:text-orange-400",
      border: "border-orange-400 dark:border-orange-500",
      borderLight: "border-orange-200 dark:border-orange-800",
      hover: "hover:bg-orange-600",
      shadow: "shadow-orange-100 dark:shadow-orange-900/20",
      gradient: "from-orange-500 to-orange-600",
    },
  };

  return colorMap[color] || colorMap.indigo; // Default to indigo if color not found
};

