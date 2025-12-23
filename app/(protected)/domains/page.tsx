export default function DomainsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-900 dark:text-white">
          Domains
        </h1>
        <p className="mt-2 text-stone-600 dark:text-stone-400">
          Manage your life areas and categories
        </p>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-12 text-center dark:border-stone-800 dark:bg-stone-950">
        <div className="mx-auto max-w-md space-y-4">
          <div className="text-6xl">📁</div>
          <h2 className="text-2xl font-semibold text-stone-900 dark:text-white">
            Domain Management
          </h2>
          <p className="text-stone-600 dark:text-stone-400">
            The domains view will be implemented in the next milestone. Here you
            will be able to create, edit, and delete your life domains with
            custom colors and icons.
          </p>
        </div>
      </div>
    </div>
  );
}
