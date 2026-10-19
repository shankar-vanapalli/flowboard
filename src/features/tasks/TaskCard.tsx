import { CalendarDays, UserRound } from "lucide-react";
import type { Task, TaskStatus, User } from "../../types";


interface TaskCardBaseProps {
  task: Task;
  status: TaskStatus;
  users: User[];
}

export function TaskCardBase({ task, status, users }: TaskCardBaseProps) {
  const assignees = users.filter((user) =>
    task.assigneeIds.includes(user.id),
  );

  return (
    <div className="w-full rounded-panel border border-border bg-surface p-4 text-left shadow-panel">
      <p className="text-sm font-medium leading-5 text-text-primary">
        {task.title}
      </p>

      {task.description && (
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-text-secondary">
          {task.description}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={`rounded px-2 py-1 text-xs font-medium capitalize ${priorityStyles[task.priority]}`}
        >
          {task.priority}
        </span>

        <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
          {status.name}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex -space-x-1.5">
          {assignees.length ? (
            assignees.map((user) => (
              <span
                key={user.id}
                title={user.name}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold text-white"
                style={{ backgroundColor: user.avatarColor }}
              >
                {user.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            ))
          ) : (
            <span className="flex items-center gap-1 text-xs text-text-muted">
              <UserRound size={14} /> Unassigned
            </span>
          )}
        </div>

        {task.dueDate && (
          <span className="flex items-center gap-1 text-xs text-text-secondary">
            <CalendarDays size={13} />
            {new Date(`${task.dueDate}T00:00:00`).toLocaleDateString(
              undefined,
              { month: "short", day: "numeric" },
            )}
          </span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Clickable card (used in list view and wherever a click opens the drawer)
// ---------------------------------------------------------------------------

interface TaskCardProps extends TaskCardBaseProps {
  onOpen: (taskId: string) => void;
}

export function TaskCard({ task, status, users, onOpen }: TaskCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(task.id)}
      className="w-full text-left transition hover:scale-[1.01] focus-visible:outline-2 focus-visible:outline-brand-500"
      aria-label={`Open task: ${task.title}`}
    >
      <TaskCardBase task={task} status={status} users={users} />
    </button>
  );
}

// Default export kept for backwards-compatibility with any existing imports.
export default TaskCard;

// ---------------------------------------------------------------------------
// Priority styles (shared)
// ---------------------------------------------------------------------------

const priorityStyles: Record<Task["priority"], string> = {
  urgent: "bg-red-50 text-red-700",
  high: "bg-orange-50 text-orange-700",
  normal: "bg-blue-50 text-blue-700",
  low: "bg-slate-100 text-slate-600",
};
