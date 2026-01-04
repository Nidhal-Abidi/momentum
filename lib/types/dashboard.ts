// =============================================================================
// Data Types
// =============================================================================

export interface AllTimeStats {
  /** Total number of completions across all domains since account creation */
  totalDaysTracked: number;
  /** Overall completion rate as a percentage (0-100) */
  overallCompletionRate: number;
  /** ISO date string when the account was created */
  accountStartDate: string;
  /** Number of days since account creation */
  accountAgeDays: number;
}

export interface MonthInfo {
  /** Human-readable month and year (e.g., "December 2024") */
  displayName: string;
  /** Year as a number */
  year: number;
  /** Month as a number (1-12) */
  month: number;
  /** Current day of the month for partial month calculations */
  currentDay: number;
}

export interface MonthlyCompletion {
  /** Number of days completed */
  completed: number;
  /** Total days in the period */
  total: number;
  /** Completion rate as a percentage (0-100) */
  rate: number;
}

export interface DomainStat {
  /** Unique identifier for the domain */
  id: string;
  /** Display name of the domain */
  name: string;
  /** Tailwind color name for visualization */
  color: string;
  /** This month's performance */
  thisMonth: MonthlyCompletion;
  /** Last month's performance for comparison */
  lastMonth: MonthlyCompletion;
  /** Percentage point difference between this month and last month */
  trend: number;
  /** Direction of the trend */
  trendDirection: "up" | "down" | "neutral";
}

export interface WeeklyData {
  /** Week label (e.g., "Week 1") */
  week: string;
  /** Week number (1-4 or 1-5) */
  weekNumber: number;
  /** Date range for this week (e.g., "Dec 1-7") */
  dateRange: string;
  /** Completion count per domain - keys are domain names */
  [domainName: string]: string | number;
}

// =============================================================================
// Component Props
// =============================================================================

export interface DashboardProps {
  /** All-time statistics across all domains */
  allTime: AllTimeStats;
  /** Current month information */
  currentMonth: MonthInfo;
  /** Per-domain statistics comparing this month to last month */
  domainStats: DomainStat[];
  /** Weekly completion data for bar chart visualization */
  weeklyData: WeeklyData[];
  /** Called when user wants to navigate to the previous month */
  onPreviousMonth?: () => void;
  /** Called when user wants to navigate to the next month */
  onNextMonth?: () => void;
  /** Called when user clicks on a specific domain card */
  onDomainClick?: (domainId: string) => void;
}

