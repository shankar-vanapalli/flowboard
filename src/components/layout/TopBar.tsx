import { useState, useRef, useEffect } from "react";
import { ChevronDown, Shield } from "lucide-react";
import { getContainerPath } from "../../lib/navigation";
import { useFlowboardStore } from "../../store/useFlowboardStore";

export default function TopBar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const containers = useFlowboardStore((state) => state.containers);
  const selectedListId = useFlowboardStore((state) => state.selectedListId);
  const users = useFlowboardStore((state) => state.users);
  const activeUserId = useFlowboardStore((state) => state.activeUserId);
  const setActiveUser = useFlowboardStore((state) => state.setActiveUser);
  const resetData = useFlowboardStore((state) => state.resetData);

  const activeUser = users.find((u) => u.id === activeUserId);

  const path = getContainerPath(containers, selectedListId).filter(
    (c) => c.type !== "workspace",
  );

  // Close dropdown when clicking outside.
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const initials = activeUser
    ? activeUser.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-6">
      {/* Breadcrumb */}
      <div className="flex min-w-0 items-center gap-1.5 overflow-hidden text-sm">
        {path.map((container, index) => (
          <span key={container.id} className="flex items-center gap-1.5">
            {index > 0 && <span className="text-text-muted">/</span>}
            <span
              className={
                index === path.length - 1
                  ? "truncate font-semibold text-text-primary"
                  : "truncate text-text-secondary"
              }
            >
              {container.name}
            </span>
          </span>
        ))}
      </div>

      {/* User switcher */}
      <div ref={menuRef} className="relative">
        <button
          type="button"
          id="user-menu-button"
          aria-haspopup="true"
          aria-expanded={userMenuOpen}
          onClick={() => setUserMenuOpen((v) => !v)}
          className="flex items-center gap-2 rounded-control border border-border px-3 py-2 text-sm hover:bg-canvas"
        >
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ backgroundColor: activeUser?.avatarColor ?? "#6366f1" }}
          >
            {initials}
          </span>
          <span className="hidden sm:inline">{activeUser?.name ?? "User"}</span>
          {activeUser?.role === "admin" && (
            <span title="Admin">
              <Shield size={12} className="text-brand-500" />
            </span>
          )}
          <ChevronDown size={15} className="text-text-secondary" />
        </button>

        {userMenuOpen && (
          <div
            role="menu"
            aria-labelledby="user-menu-button"
            className="absolute right-0 top-full z-30 mt-1 w-72 rounded-panel border border-border bg-surface shadow-panel"
          >
            {/* Switch user */}
            <div className="px-3 py-2">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Switch user (permission testing)
              </p>
              {users.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setActiveUser(user.id);
                    setUserMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-control px-2 py-2 text-left text-sm transition-colors hover:bg-canvas ${
                    user.id === activeUserId
                      ? "bg-brand-50 text-brand-700"
                      : "text-text-primary"
                  }`}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: user.avatarColor }}
                  >
                    {user.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 font-medium">
                      {user.name}
                      {user.role === "admin" && (
                        <Shield size={11} className="text-brand-500" />
                      )}
                    </p>
                    <p className="truncate text-xs text-text-secondary">
                      {user.email}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      user.role === "admin"
                        ? "bg-brand-100 text-brand-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </button>
              ))}
            </div>

            {/* Access legend */}
            <div className="border-t border-border px-3 py-2">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Access matrix
              </p>
              <div className="space-y-1 text-xs text-text-secondary">
                <p><span className="font-medium text-text-primary">Alice</span> — admin, full access to all lists</p>
                <p><span className="font-medium text-text-primary">Bob</span> — Engineering (view-only), Research (view·edit)</p>
                <p><span className="font-medium text-text-primary">Carol</span> — Engineering denied, Research view-only</p>
              </div>
            </div>

            {/* Reset */}
            <div className="border-t border-border px-3 py-2">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  resetData();
                  setUserMenuOpen(false);
                }}
                className="w-full rounded-control px-2 py-1.5 text-left text-xs font-medium text-red-600 hover:bg-red-50"
              >
                Reset all data to seed state
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}