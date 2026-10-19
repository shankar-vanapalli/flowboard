import type { Task, TaskStatus, User } from "../../types";

interface TaskListViewProps {
  tasks: Task[];
  statuses: TaskStatus[];
  users: User[];
  onOpenTask: (taskId: string) => void;
}

export default function TaskListView({
  tasks,
  statuses,
  users,
  onOpenTask,
}: TaskListViewProps) {
  const statusById = new Map(
    statuses.map((status) => [status.id, status]),
  );

  const userById = new Map(
    users.map((user) => [user.id, user]),
  );

  const orderedTasks = [...tasks].sort(
    (a, b) => a.position - b.position,
  );

  return (
    <div className="overflow-x-auto rounded-panel border border-border bg-surface">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-text-secondary">
          <tr>
            <th className="px-4 py-3 font-medium">Task</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Priority</th>
            <th className="px-4 py-3 font-medium">Assignee</th>
            <th className="px-4 py-3 font-medium">Due date</th>
          </tr>
        </thead>

        <tbody>
          {orderedTasks.map((task) => {
            const status = statusById.get(task.statusId);
            const assignees = task.assigneeIds
              .map((id) => userById.get(id)?.name)
              .filter(Boolean);

            return (
              <tr
                key={task.id}
                className="border-t border-border hover:bg-slate-50"
              >
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onOpenTask(task.id)}
                    className="text-left font-medium text-text-primary hover:text-brand-700"
                  >
                    {task.title}
                  </button>
                </td>

                <td className="px-4 py-3">
                  {status?.name ?? "Unknown status"}
                </td>

                <td className="px-4 py-3 capitalize">
                  {task.priority}
                </td>

                <td className="px-4 py-3">
                  {assignees.length ? assignees.join(", ") : "Unassigned"}
                </td>

                <td className="px-4 py-3 text-text-secondary">
                  {task.dueDate ?? "—"}
                </td>
              </tr>
            );
          })}

          {orderedTasks.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-12 text-center text-text-secondary"
              >
                No tasks in this list yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
