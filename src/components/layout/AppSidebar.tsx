
import { Layers3 } from "lucide-react";

import WorkspaceTree from "./WorkspaceTree";
import { selectVisibleContainers } from "../../lib/selectors";
import { useFlowboardStore } from "../../store/useFlowboardStore";

export default function AppSidebar() {
  const containers = useFlowboardStore((state) => state.containers);
  const grants = useFlowboardStore((state) => state.grants);
  const users = useFlowboardStore((state) => state.users);
  const activeUserId = useFlowboardStore((state) => state.activeUserId);
  const selectedListId = useFlowboardStore((state) => state.selectedListId);
  const expandedContainerIds = useFlowboardStore(
    (state) => state.expandedContainerIds,
  );
  const selectList = useFlowboardStore((state) => state.selectList);
  const toggleContainer = useFlowboardStore((state) => state.toggleContainer);

  const visibleContainers = selectVisibleContainers(
    { containers, grants, users, tasks: [], statuses: [] },
    activeUserId,
  );

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-surface">
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-control bg-brand-600 text-lg font-bold text-white">
          F
        </div>
        <div>
          <p className="font-semibold tracking-tight">Flowboard</p>
          <p className="text-xs text-text-secondary">Acme Workspace</p>
        </div>
      </div>

      {/* Navigation */}
      <nav
        aria-label="Workspace navigation"
        className="flex-1 overflow-y-auto px-3 py-4"
      >
        {/* Top-level links */}
        <div className="space-y-0.5">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-control px-3 py-2 text-sm text-text-secondary hover:bg-canvas hover:text-text-primary"
          >
            <Layers3 size={18} />
            Overview
          </button>
        </div>

        {/* Spaces tree */}
        <div className="mt-5">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Spaces
          </p>

          {visibleContainers.some((c) => c.type === "space") ? (
            <WorkspaceTree
              containers={visibleContainers}
              selectedListId={selectedListId}
              expandedContainerIds={expandedContainerIds}
              onSelectList={selectList}
              onToggleContainer={toggleContainer}
            />
          ) : (
            <p className="px-3 py-2 text-sm text-text-muted">
              No spaces available.
            </p>
          )}
        </div>
      </nav>
    </aside>
  );
}
