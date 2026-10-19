import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task, TaskStatus, User } from "../../types";
import { TaskCard } from "./TaskCard";

interface SortableTaskCardProps {
  task: Task;
  status: TaskStatus;
  users: User[];
  onOpen: (taskId: string) => void;
}

export function SortableTaskCard({
  task,
  status,
  users,
  onOpen,
}: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      statusId: task.statusId,
    },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      // touch-none prevents scroll interference on mobile during drag.
      // opacity-40 gives a "ghost" placeholder while dragging.
      className={`touch-none ${isDragging ? "opacity-40" : ""}`}
      {...attributes}
      {...listeners}
    >
      <TaskCard task={task} status={status} users={users} onOpen={onOpen} />
    </div>
  );
}
