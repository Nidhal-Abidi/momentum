import { useState, useMemo } from "react";

interface UseMonthNavigationReturn {
  month: number;
  year: number;
  isCurrentMonth: boolean;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  canGoNext: boolean;
}

export function useMonthNavigation(): UseMonthNavigationReturn {
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // 1-12
  const currentYear = today.getFullYear();

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const isCurrentMonth = month === currentMonth && year === currentYear;

  // Can't navigate beyond current month
  const canGoNext = !isCurrentMonth;

  const goToPreviousMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const goToNextMonth = () => {
    if (!canGoNext) return;

    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  return {
    month,
    year,
    isCurrentMonth,
    goToPreviousMonth,
    goToNextMonth,
    canGoNext,
  };
}

