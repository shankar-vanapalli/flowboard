import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { X } from "lucide-react";
import type { Task, TaskStatus } from "../../types";

interface TaskDetailDrawerProps {
  task: Task;
  statuses: TaskStatus[];
  canEdit: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Task>) => void;
  onDelete: () => void;
}

export default function TaskDetailDrawer({
  task,
  statuses,
  canEdit,
  onClose,
  onSave,
  onDelete,
}: TaskDetailDrawerProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState<Task["priority"]>(task.priority);
  const [statusId, setStatusId] = useState(task.statusId);
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setStatusId(task.statusId);
    setError("");
  }, [task]);

  function handleStatusChange(newStatusId: string) {
    setStatusId(newStatusId);
    if (canEdit) {
      try {
        onSave({ statusId: newStatusId });
        setError("");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to update status.",
        );
      }
    }
  }

  function handlePriorityChange(newPriority: Task["priority"]) {
    setPriority(newPriority);
    if (canEdit) {
      try {
        onSave({ priority: newPriority });
        setError("");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to update priority.",
        );
      }
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    try {
      onSave({
        title: title.trim(),
        description,
        priority,
        statusId,
      });
      setError("");
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save task.",
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close task details"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/30"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-drawer-title"
        className="relative flex h-full w-full max-w-xl flex-col border-l border-border bg-surface shadow-2xl"
      >
        <header className="flex h-16 items-center justify-between border-b border-border px-6">
          <h2 id="task-drawer-title" className="font-semibold">
            Task details
          </h2>

          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-control p-2 text-text-secondary hover:bg-canvas"
          >
            <X size={18} />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-y-auto"
        >
          <div className="flex-1 space-y-5 p-6">
            <div>
              <label
                htmlFor="task-title"
                className="mb-2 block text-sm font-medium"
              >
                Task title
              </label>
              <input
                id="task-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                disabled={!canEdit}
                className="w-full rounded-control border border-border px-3 py-2 text-sm disabled:bg-slate-50 disabled:text-text-secondary"
              />
            </div>

            <div>
              <label
                htmlFor="task-description"
                className="mb-2 block text-sm font-medium"
              >
                Description
              </label>
              <textarea
                id="task-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                disabled={!canEdit}
                rows={5}
                className="w-full resize-y rounded-control border border-border px-3 py-2 text-sm disabled:bg-slate-50 disabled:text-text-secondary"
              />
            </div>

            <div>
              <label
                htmlFor="task-status"
                className="mb-2 block text-sm font-medium"
              >
                Status
              </label>
              <select
                id="task-status"
                value={statusId}
                onChange={(event) => handleStatusChange(event.target.value)}
                disabled={!canEdit}
                className="w-full rounded-control border border-border px-3 py-2 text-sm disabled:bg-slate-50 disabled:text-text-secondary"
              >
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="task-priority"
                className="mb-2 block text-sm font-medium"
              >
                Priority
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={(event) =>
                  handlePriorityChange(event.target.value as Task["priority"])
                }
                disabled={!canEdit}
                className="w-full rounded-control border border-border px-3 py-2 text-sm capitalize disabled:bg-slate-50 disabled:text-text-secondary"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
                <option value="low">Low</option>
              </select>
            </div>

            <p className="text-xs text-text-secondary">
              Created {new Date(task.createdAt).toLocaleString()}
            </p>

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          <footer className="flex items-center justify-between gap-3 border-t border-border p-5">
            {canEdit ? (
              <button
                type="button"
                onClick={onDelete}
                className="rounded-control px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Delete task
              </button>
            ) : (
              <span className="text-xs text-text-secondary">
                Read-only access
              </span>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-control border border-border px-4 py-2 text-sm hover:bg-canvas"
              >
                Close
              </button>

              {canEdit && (
                <button
                  type="submit"
                  className="rounded-control bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
                >
                  Save changes
                </button>
              )}
            </div>
          </footer>
        </form>
      </aside>
    </div>
  );
}
