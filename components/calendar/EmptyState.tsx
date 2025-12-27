import { Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/shadcn/button";

export function EmptyState() {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-linear-to-br from-stone-50 to-white px-6 py-16 text-center shadow-inner dark:border-stone-700 dark:from-stone-900/50 dark:to-stone-950">
      <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-indigo-600 shadow-lg">
        <CalendarIcon className="size-10 text-white" strokeWidth={2} />
      </div>
      <h2 className="mb-3 text-2xl font-bold text-stone-900 dark:text-white">
        Start tracking your life!
      </h2>
      <p className="mb-6 max-w-md text-stone-600 dark:text-stone-400">
        Create domains first to see your calendars here. Domains represent the
        different areas of life you want to track and improve.
      </p>
      <Link href="/domains">
        <Button className="bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700">
          Create Your First Domain
        </Button>
      </Link>
    </div>
  );
}
