
import { canAccessContainer } from "./permissions";
import type {
  Container,
  FlowboardData,
  ID,
  Task,
} from "../types";

export function selectVisibleContainers(
  data: FlowboardData,
  userId: ID,
): Container[] {
  return data.containers.filter(
    (container) =>
      !container.deletedAt &&
      !container.archivedAt &&
      canAccessContainer(container.id, "view", userId, data),
  );
}

export function selectVisibleTasks(
  data: FlowboardData,
  userId: ID,
): Task[] {
  const visibleContainers = selectVisibleContainers(data, userId);

  const visibleListIds = new Set(
    visibleContainers
      .filter((container) => container.type === "list")
      .map((container) => container.id),
  );

  return data.tasks.filter(
    (task) =>
      visibleListIds.has(task.listId) &&
      !task.deletedAt &&
      !task.archivedAt,
  );
}

export function selectTasksForList(
  data: FlowboardData,
  userId: ID,
  listId: ID,
): Task[] {
  return selectVisibleTasks(data, userId)
    .filter((task) => task.listId === listId)
    .sort((a, b) => a.position - b.position);
}
