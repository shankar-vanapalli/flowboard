import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  CircleDashed,
  Clock3,
  LayoutGrid,
  LayoutList,
  Plus,
} from "lucide-react";

import AppSidebar from "./components/layout/AppSidebar";
import TopBar from "./components/layout/TopBar";
import TaskBoard from "./features/tasks/TaskBoard";
import TaskDetailDrawer from "./features/tasks/TaskDetailDrawer";
import TaskListView from "./features/tasks/TaskListView";
import { ToastContainer, useToastStore } from "./components/ui/Toast";
import { canAccessContainer } from "./lib/permissions";
import { getContainerPath } from "./lib/navigation";
import { selectVisibleTasks } from "./lib/selectors";
import { useFlowboardStore } from "./store/useFlowboardStore";
import type { Task } from "./types";

type ViewMode = "board" | "list";

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>("board");
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [createError, setCreateError] = useState("");

  const containers = useFlowboardStore((state) => state.containers);
  const tasks = useFlowboardStore((state) => state.tasks);
  const statuses = useFlowboardStore((state) => state.statuses);
  const users = useFlowboardStore((state) => state.users);
  const grants = useFlowboardStore((state) => state.grants);
  const activeUserId = useFlowboardStore((state) => state.activeUserId);
  const selectedListId = useFlowboardStore((state) => state.selectedListId);
  const updateTask = useFlowboardStore((state) => state.updateTask);
  const createTask = useFlowboardStore((state) => state.createTask);
  const deleteTask = useFlowboardStore((state) => state.deleteTask);
  const addToast = useToastStore((state) => state.addToast);

  const data = useMemo(
    () => ({ containers, tasks, statuses, users, grants }),
    [containers, tasks, statuses, users, grants],
  );

  const visibleTasks = useMemo(
    () => selectVisibleTasks(data, activeUserId),
    [data, activeUserId],
  );

  const selectedList = containers.find(
    (container) =>
      container.id === selectedListId &&
      container.type === "list",
  );

  const path = getContainerPath(containers, selectedListId);
  const parentPath = path
    .slice(0, -1)
    .filter((container) => container.type !== "workspace");

  const listStatuses = statuses
    .filter((status) => status.listId === selectedListId)
    .sort((a, b) => a.position - b.position);

  const listTasks = visibleTasks
    .filter((task) => task.listId === selectedListId)
    .sort((a, b) => a.position - b.position);

  const selectedTask = visibleTasks.find(
    (task) => task.id === openTaskId,
  );

  const canEdit = selectedList
    ? canAccessContainer(selectedList.id, "edit", activeUserId, data)
    : false;

  function handleCreateTask() {
    if (!selectedListId) return;

    const title = newTaskTitle.trim();
    if (!title) {
      setCreateError("Enter a task title.");
      setShowCreateForm(true);
      return;
    }

    try {
      const taskId = createTask(selectedListId, title);

      setNewTaskTitle("");
      setCreateError("");
      setShowCreateForm(false);
      setOpenTaskId(taskId);
      addToast("Task created.", "success");
    } catch (error) {
      setCreateError(
        error instanceof Error ? error.message : "Could not create task.",
      );
      setShowCreateForm(true);
    }
  }

  function handleSaveTask(updates: Partial<Task>, targetTaskId?: string) {
    const id = targetTaskId ?? openTaskId;
    if (!id) return;
    try {
      updateTask(id, updates);
      addToast("Task saved.", "success");
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Could not save task.",
        "error",
      );
      throw error;
    }
  }

  function handleDeleteTask() {
    if (!openTaskId) return;

    try {
      deleteTask(openTaskId);
      setOpenTaskId(null);
      addToast("Task deleted.", "success");
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Could not delete task.",
        "error",
      );
    }
  }

  const countByCategory = (category: string) =>
    listTasks.filter((task) =>
      listStatuses.some(
        (status) =>
          status.id === task.statusId &&
          status.category === category,
      ),
    ).length;

  return (
    <>
    <div className="flex h-screen overflow-hidden bg-canvas">
      <AppSidebar />

      <main className="flex min-w-0 flex-1 flex-col">
        <TopBar />

        <section className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-7">
            {/* Page heading */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm text-text-secondary">
                  {parentPath.map((container) => container.name).join(" / ")}
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                  {selectedList?.name ?? "Select a list"}
                </h1>
                <p className="mt-2 text-sm text-text-secondary">
                  {listTasks.length} active task{listTasks.length !== 1 ? "s" : ""} in this list.
                </p>
              </div>

              <button
                type="button"
                disabled={!selectedList || !canEdit}
                onClick={() => {
                  setShowCreateForm(true);
                  setCreateError("");
                }}
                className="flex items-center gap-2 rounded-control bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={17} />
                New task
              </button>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <SummaryCard
                label="To do"
                value={String(countByCategory("not_started"))}
                description="Tasks not started"
                icon={<CircleDashed size={19} />}
                iconClass="bg-slate-100 text-slate-600"
              />
              <SummaryCard
                label="In progress"
                value={String(countByCategory("active"))}
                description="Tasks being worked on"
                icon={<Clock3 size={19} />}
                iconClass="bg-brand-50 text-brand-600"
              />
              <SummaryCard
                label="Completed"
                value={String(countByCategory("completed"))}
                description="Tasks finished"
                icon={<CheckCircle2 size={19} />}
                iconClass="bg-green-50 text-green-600"
              />
            </div>

            {/* Inline create form */}
            {showCreateForm && (
              <form
                className="flex flex-wrap items-start gap-3 rounded-panel border border-border bg-surface p-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleCreateTask();
                }}
              >
                <div className="min-w-0 flex-1">
                  <label
                    htmlFor="new-task-title"
                    className="mb-1 block text-sm font-medium"
                  >
                    Task title
                  </label>
                  <input
                    id="new-task-title"
                    autoFocus
                    value={newTaskTitle}
                    onChange={(event) => setNewTaskTitle(event.target.value)}
                    placeholder="e.g. Improve dashboard loading"
                    className="w-full rounded-control border border-border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  {createError && (
                    <p role="alert" className="mt-2 text-sm text-red-600">
                      {createError}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setCreateError("");
                    }}
                    className="rounded-control border border-border px-3 py-2 text-sm hover:bg-canvas"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-control bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
                  >
                    Create
                  </button>
                </div>
              </form>
            )}

            {/* Tasks section */}
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-semibold">Tasks</h2>

                <div className="inline-flex rounded-control border border-border bg-surface p-1">
                  <button
                    type="button"
                    aria-pressed={viewMode === "list"}
                    onClick={() => setViewMode("list")}
                    className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm transition-colors ${
                      viewMode === "list"
                        ? "bg-brand-50 font-medium text-brand-700"
                        : "text-text-secondary hover:bg-canvas"
                    }`}
                  >
                    <LayoutList size={16} />
                    List
                  </button>
                  <button
                    type="button"
                    aria-pressed={viewMode === "board"}
                    onClick={() => setViewMode("board")}
                    className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm transition-colors ${
                      viewMode === "board"
                        ? "bg-brand-50 font-medium text-brand-700"
                        : "text-text-secondary hover:bg-canvas"
                    }`}
                  >
                    <LayoutGrid size={16} />
                    Board
                  </button>
                </div>
              </div>

              {!selectedList ? (
                <div className="rounded-panel border border-border bg-surface p-12 text-center">
                  <CalendarDays className="mx-auto text-text-muted" size={28} />
                  <p className="mt-3 font-medium">Select a list</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Choose a list from the workspace sidebar.
                  </p>
                </div>
              ) : listTasks.length === 0 && !showCreateForm ? (
                <div className="rounded-panel border border-border bg-surface p-12 text-center">
                  <p className="font-medium">No tasks yet</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {canEdit
                      ? "Click \"New task\" to start organizing this list."
                      : "No tasks have been added to this list."}
                  </p>
                </div>
              ) : viewMode === "board" ? (
                <TaskBoard
                  tasks={listTasks}
                  statuses={listStatuses}
                  users={users}
                  onOpenTask={setOpenTaskId}
                  onAddTask={() => {
                    setShowCreateForm(true);
                    setCreateError("");
                  }}
                />
              ) : (
                <TaskListView
                  tasks={listTasks}
                  statuses={listStatuses}
                  users={users}
                  onOpenTask={setOpenTaskId}
                />
              )}
            </section>
          </div>
        </section>
      </main>

      {selectedTask && (
        <TaskDetailDrawer
          key={selectedTask.id}
          task={selectedTask}
          statuses={statuses.filter(
            (status) => status.listId === selectedTask.listId,
          )}
          canEdit={canEdit}
          onClose={() => setOpenTaskId(null)}
          onSave={(updates) => handleSaveTask(updates, selectedTask.id)}
          onDelete={handleDeleteTask}
        />
      )}
    </div>

    <ToastContainer />
  </>
  );
}

// ---------------------------------------------------------------------------
// SummaryCard
// ---------------------------------------------------------------------------

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
          <p className="text-sm font-medium text-text-secondary">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-control ${iconClass}`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-3 text-xs text-text-secondary">{description}</p>
    </div>
  );
}