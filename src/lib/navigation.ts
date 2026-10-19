
import type { Container, ID } from "../types";

export function getContainerPath(
  containers: Container[],
  containerId: ID | null,
): Container[] {
  if (!containerId) return [];

  const byId = new Map(
    containers.map((container) => [container.id, container]),
  );

  const path: Container[] = [];
  const visited = new Set<ID>();
  let current = byId.get(containerId);

  while (current) {
    if (visited.has(current.id)) return [];

    visited.add(current.id);
    path.unshift(current);

    if (!current.parentId) break;

    current = byId.get(current.parentId);
  }

  return path;
}
