import {
  ChevronDown,
  ChevronRight,
  CircleHelp,
  FolderKanban,
  Layers3,
  Plus,
  Search,
  Settings2,
} from "lucide-react";

export default function AppSidebar() {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-surface">
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-control bg-brand-600 text-lg font-bold text-white">
          F
        </div>

        <div>
          <p className="font-semibold tracking-tight">
            Flowboard
          </p>
          <p className="text-xs text-text-secondary">
            Workspace
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 pt-5">
        <button className="flex w-full items-center gap-2 rounded-control border border-border px-3 py-2 text-sm text-text-secondary hover:bg-canvas">
          <Search size={16} />
          <span className="flex-1 text-left">
            Search
          </span>
          <span className="rounded border border-border px-1.5 py-0.5 text-xs">
            Ctrl K
          </span>
        </button>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        <button className="flex w-full items-center gap-3 rounded-control px-3 py-2 text-sm text-text-secondary hover:bg-canvas hover:text-text-primary">
          <Layers3 size={18} />
          Overview
        </button>

        <div className="pt-5">
          <div className="flex items-center justify-between px-3 pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Workspace
            </span>
            <button
              aria-label="Add workspace item"
              className="rounded p-1 text-text-secondary hover:bg-canvas"
            >
              <Plus size={16} />
            </button>
          </div>

          <button className="flex w-full items-center gap-2 rounded-control px-3 py-2 text-sm font-medium hover:bg-canvas">
            <ChevronDown size={15} className="text-text-muted" />
            <FolderKanban size={17} className="text-brand-600" />
            Engineering
          </button>

          <div className="ml-5 border-l border-border pl-3">
            <button className="flex w-full items-center gap-2 rounded-control px-2 py-2 text-sm text-text-secondary hover:bg-canvas">
              <ChevronRight size={14} />
              Q2 Launch
            </button>

            <button className="flex w-full items-center gap-2 rounded-control bg-brand-50 px-2 py-2 text-sm font-medium text-brand-700">
              <span className="h-2 w-2 rounded-full bg-brand-600" />
              Backlog
            </button>
          </div>

          <button className="mt-1 flex w-full items-center gap-2 rounded-control px-3 py-2 text-sm text-text-secondary hover:bg-canvas">
            <ChevronRight size={15} />
            Design
          </button>
        </div>
      </nav>

      {/* Bottom navigation */}
      <div className="space-y-1 border-t border-border p-3">
        <button className="flex w-full items-center gap-3 rounded-control px-3 py-2 text-sm text-text-secondary hover:bg-canvas">
          <Settings2 size={17} />
          Settings
        </button>

        <button className="flex w-full items-center gap-3 rounded-control px-3 py-2 text-sm text-text-secondary hover:bg-canvas">
          <CircleHelp size={17} />
          Help & feedback
        </button>
      </div>
    </aside>
);
}