import {
  Bell,
  ChevronDown,
  Plus,
  Search,
} from "lucide-react";

export default function TopBar() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-6">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-text-secondary">
          Engineering
        </span>
        <span className="text-text-muted">/</span>
        <span className="font-semibold">
          Backlog
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          aria-label="Search tasks"
          className="rounded-control p-2 text-text-secondary hover:bg-canvas"
        >
          <Search size={18} />
        </button>

        <button
          aria-label="Notifications"
          className="rounded-control p-2 text-text-secondary hover:bg-canvas"
        >
          <Bell size={18} />
        </button>

        <button className="ml-2 flex items-center gap-2 rounded-control border border-border px-3 py-2 text-sm hover:bg-canvas">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
            A
          </span>
          <span>Alice</span>
          <ChevronDown
            size={15}
            className="text-text-secondary"
          />
        </button>

        <button className="ml-1 flex items-center gap-2 rounded-control bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700">
          <Plus size={16} />
          Create
        </button>
      </div>
    </header>
  );
}