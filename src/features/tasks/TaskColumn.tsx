import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import type { Task, TaskStatus, User } from "../../types";
import { SortableTaskCard } from "./SortableTaskCard";

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  users: User[];
  onOpenTask: (taskId: string) => void;
  onAddTask: (statusId?: string) => void;
}

const statusDot: Record<TaskStatus["category"], string> = {
  not_started: "bg-slate-400",
  active: "bg-blue-500",
  completed: "bg-green-500",
};

export function TaskColumn({
  status,
  tasks,
  users,
  onOpenTask,
  onAddTask,
}: TaskColumnProps) {
  // Prefix column droppable IDs so they never clash with task IDs.
  const { setNodeRef, isOver } = useDroppable({
    id: `column:${status.id}`,
    data: {
      type: "column",
      statusId: status.id,
    },
  });

  const orderedTasks = [...tasks].sort(
    (a, b) => a.position - b.position,
  );

  return (
    <section
      aria-label={`${status.name} column`}
      className="w-72 shrink-0 flex flex-col rounded-panel transition-colors"
    >
      {/* Column header */}
      <div
        className={`mb-3 flex items-center justify-between gap-2 rounded-panel px-3 py-2 ${
          isOver ? "bg-brand-50" : "bg-slate-100/80"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusDot[status.category]}`}
          />
          <h2 className="truncate text-sm font-semibold">{status.name}</h2>
          <span className="text-xs text-text-muted">{orderedTasks.length}</span>
        </div>

        {status.category === "not_started" && (
          <button
            type="button"
            aria-label={`Add task to ${status.name}`}
            onClick={() => onAddTask(status.id)}
            className="rounded p-1 text-text-secondary hover:bg-white"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {/* Droppable + sortable cards area */}
      <div
        ref={setNodeRef}
        className={`flex-1 rounded-panel p-2 transition-colors ${
          isOver ? "bg-brand-50/60 ring-1 ring-brand-300" : "bg-slate-100/50"
        }`}
      >
        <SortableContext
          items={orderedTasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {orderedTasks.map((task) => (
              <SortableTaskCard
                key={task.id}
                task={task}
                status={status}
                users={users}
                onOpen={onOpenTask}
              />
            ))}
          </div>
        </SortableContext>

        {orderedTasks.length === 0 && (
          <div
            className={`flex min-h-24 items-center justify-center rounded-control border border-dashed transition-colors ${
              isOver
                ? "border-brand-400 bg-brand-50"
                : "border-slate-300"
            }`}
          >
            <p className="text-xs text-text-muted">
              {isOver ? "Drop here" : "No tasks in this status"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
