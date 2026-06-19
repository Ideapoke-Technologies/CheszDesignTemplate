import { Link } from "react-router-dom";
import { ArrowRight, LayoutGrid } from "lucide-react";

import { sampleRoutes } from "./sampleRoutes";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <header className="border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#40ed96] to-[#00db6e] text-sm font-black text-[#0f2644]">
            C
          </div>
          <div>
            <h1 className="text-lg font-black leading-none text-[#0f2644]">
              CHESZ
            </h1>
            <p className="mt-0.5 text-xs text-[#64748b]">Sample UI Gallery</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#d1fae5] bg-[#ecfdf5] px-3 py-1 text-xs font-medium text-[#047857]">
            <LayoutGrid className="h-3.5 w-3.5" />
            Chesz AI Design Templates
          </div>
          <h2 className="text-2xl font-bold text-[#0f2644]">
            Explore sample interfaces
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#64748b]">
            Browse interactive UI prototypes built for Chesz AI. Select a sample
            below to open the full page experience.
          </p>
        </div>

        <ul className="grid gap-3">
          {sampleRoutes.map(({ path, title, description }) => (
            <li key={path}>
              <Link
                to={path}
                className="group flex items-center justify-between rounded-xl border border-[#e5e7eb] bg-white px-5 py-4 shadow-sm transition hover:border-[#40ed96] hover:shadow-md"
              >
                <div>
                  <h3 className="text-sm font-semibold text-[#0f2644] group-hover:text-[#047857]">
                    {title}
                  </h3>
                  <p className="mt-1 text-xs text-[#64748b]">{description}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#94a3b8] transition group-hover:translate-x-0.5 group-hover:text-[#00db6e]" />
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
