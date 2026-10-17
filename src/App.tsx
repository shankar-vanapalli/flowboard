import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Plus,
} from "lucide-react";

import AppSidebar from "./components/layout/AppSidebar";
import TopBar from "./components/layout/TopBar";

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <AppSidebar />

      <main className="flex min-w-0 flex-1 flex-col">
        <TopBar />

        <section className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mx-auto max-w-6xl space-y-8">
            {/* Page heading */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm text-text-secondary">
                  Engineering / Q2 Launch
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                  Backlog
                </h1>

                <p className="mt-2 text-sm text-text-secondary">
                  Plan work, track progress, and keep your
                  team aligned.
                </p>
              </div>

              <button className="flex items-center gap-2 rounded-control bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-700">
                <Plus size={17} />
                New task
              </button>
            </div>

            {/* Summary cards: visual placeholders */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <SummaryCard
                label="To do"
                value="08"
                description="Tasks not started"
                icon={<CircleDashed size={19} />}
                iconClass="bg-slate-100 text-slate-600"
              />

              <SummaryCard
                label="In progress"
                value="05"
                description="Tasks being worked on"
                icon={<Clock3 size={19} />}
                iconClass="bg-brand-50 text-brand-600"
              />

              <SummaryCard
                label="Completed"
                value="12"
                description="Tasks finished"
                icon={<CheckCircle2 size={19} />}
                iconClass="bg-green-50 text-green-600"
              />
            </div>

            {/* Main content placeholder */}
            <section className="rounded-panel border border-border bg-surface p-8 shadow-panel">
              <div className="mx-auto flex max-w-lg flex-col items-center py-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-panel bg-brand-50 text-brand-600">
                  <CalendarDays size={26} />
                </div>

                <h2 className="mt-5 text-lg font-semibold">
                  Your workspace is ready
                </h2>

                <p className="mt-2 max-w-sm text-sm leading-6 text-text-secondary">
                  This is where your task board and list view
                  will appear. Next, we&apos;ll connect the
                  interface to typed data and a central store.
                </p>

                <button className="mt-5 inline-flex items-center gap-2 rounded-control border border-border px-4 py-2 text-sm font-medium hover:bg-canvas">
                  Explore workspace
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  iconClass: string;
}

function SummaryCard({
  label,
  value,
  description,
  icon,
  iconClass,
}: SummaryCardProps) {
  return (
    <div className="rounded-panel border border-border bg-surface p-5 shadow-panel">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary">
            {label}
          </p>

          <p className="mt-3 text-3xl font-semibold tracking-tight">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-control ${iconClass}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs text-text-secondary">
        {description}
      </p>
    </div>
  );
}