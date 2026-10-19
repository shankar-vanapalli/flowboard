import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import type { Task, TaskStatus, User } from "../../types";
import { useFlowboardStore } from "../../store/useFlowboardStore";
import { useToastStore } from "../../components/ui/Toast";
import { TaskColumn } from "./TaskColumn";
import { TaskCardBase } from "./TaskCard";

interface TaskBoardProps {
  tasks: Task[];
  statuses: TaskStatus[];
  users: User[];
  onOpenTask: (taskId: string) => void;
  onAddTask: (statusId?: string) => void;
}

export default function TaskBoard({
  tasks,
  statuses,
  users,
  onOpenTask,
  onAddTask,
}: TaskBoardProps) {
  const moveTask = useFlowboardStore((state) => state.moveTask);
  const addToast = useToastStore((state) => state.addToast);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Build a status lookup map for the drag overlay.
  const statusById = useMemo(
    () => new Map(statuses.map((s) => [s.id, s])),
    [statuses],
  );

  // 6-px distance threshold so a normal click never starts a drag.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const orderedStatuses = [...statuses].sort(
    (a, b) => a.position - b.position,
  );

  // -------------------------------------------------------------------------
  // Drag handlers
  // -------------------------------------------------------------------------

  function handleDragStart(event: DragStartEvent) {
    const taskId = String(event.active.id);
    setActiveTask(tasks.find((task) => task.id === taskId) ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const draggedTask = tasks.find((task) => task.id === activeId);
    if (!draggedTask) return;

    const overIsColumn = overId.startsWith("column:");

    // Determine the target status.
    const targetStatusId = overIsColumn
      ? overId.slice("column:".length)
      : tasks.find((task) => task.id === overId)?.statusId;

    if (!targetStatusId) return;

    // Guard: only allow dropping within the statuses visible on this board.
    if (!statuses.some((s) => s.id === targetStatusId)) return;

    // Build the destination list (moving task excluded) to find insertion index.
    const destinationTasks = tasks
      .filter(
        (task) =>
          task.statusId === targetStatusId && task.id !== activeId,
      )
      .sort((a, b) => a.position - b.position);

    // Dropping on a card → insert before that card.
    // Dropping on the column backdrop → append at the end.
    const targetTask = overIsColumn
      ? undefined
      : tasks.find((task) => task.id === overId);

    const targetIndex = targetTask
      ? destinationTasks.findIndex((task) => task.id === targetTask.id)
      : -1;

    const targetPosition =
      targetIndex >= 0 ? targetIndex : destinationTasks.length;

    const result = moveTask({
      taskId: activeId,
      targetStatusId,
      targetPosition,
    });

    if (!result.success) {
      addToast(result.error.message, "error");
    }
  }

  function handleDragCancel() {
    setActiveTask(null);
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex min-h-[420px] gap-4 overflow-x-auto pb-4">
        {orderedStatuses.map((status) => (
          <TaskColumn
            key={status.id}
            status={status}
            tasks={tasks.filter((task) => task.statusId === status.id)}
            users={users}
            onOpenTask={onOpenTask}
            onAddTask={onAddTask}
          />
        ))}
      </div>

      {/* Floating drag-overlay card — rendered outside any scroll container */}
      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div className="rotate-1 opacity-95 shadow-2xl">
            <TaskCardBase
              task={activeTask}
              status={statusById.get(activeTask.statusId) ?? statuses[0]}
              users={users}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
