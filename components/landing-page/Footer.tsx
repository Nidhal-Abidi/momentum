export const Footer = () => (
  <footer className="bg-slate-50 border-t border-slate-100 py-20">
    <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="space-y-4">
        <span className="text-2xl font-extrabold tracking-tighter text-slate-900 font-headline">
          Momentum
        </span>
        <p className="text-sm text-slate-500">
          © 2024 Momentum Tracking. Designed for clarity.
        </p>
      </div>

      <div>
        <h5 className="font-bold text-slate-900 uppercase text-[10px] tracking-widest mb-6">
          Domains
        </h5>
        <ul className="space-y-3 text-sm text-slate-500">
          {["Career", "Health", "Learning", "Creative Projects"].map((item) => (
            <li key={item}>
              <a
                href="#"
                className="hover:text-momentum-primary transition-colors"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h5 className="font-bold text-slate-900 uppercase text-[10px] tracking-widest mb-6">
          Resources
        </h5>
        <ul className="space-y-3 text-sm text-slate-500">
          {["Privacy Policy", "Terms of Service"].map((item) => (
            <li key={item}>
              <a
                href="#"
                className="hover:text-momentum-primary transition-colors"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h5 className="font-bold text-slate-900 uppercase text-[10px] tracking-widest mb-6">
          Get App
        </h5>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-200" />
          <div className="w-10 h-10 rounded-xl bg-slate-200" />
        </div>
      </div>
    </div>
  </footer>
);
