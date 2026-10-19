
import type {
  Container,
  ID,
  Permission,
  PermissionGrant,
  User,
} from "../types";

export class PermissionError extends Error {
  readonly status = 403;

  constructor(message = "You do not have permission to perform this action.") {
    super(message);
    this.name = "PermissionError";
  }
}

interface PermissionContext {
  containers: Container[];
  grants: PermissionGrant[];
  users: User[];
}

export function canAccessContainer(
  containerId: ID,
  permission: Permission,
  userId: ID,
  context: PermissionContext,
): boolean {
  const user = context.users.find((item) => item.id === userId);

  if (!user) return false;

  // Administrators bypass container permissions.
  if (user.role === "admin") return true;

  const byId = new Map(
    context.containers.map((container) => [container.id, container]),
  );

  const chain: Container[] = [];
  let current = byId.get(containerId);

  // Collect target + ancestors and detect malformed parent cycles.
  const visited = new Set<ID>();

  while (current) {
    if (visited.has(current.id)) return false;

    visited.add(current.id);
    chain.push(current);

    if (current.deletedAt || current.archivedAt) {
      return false;
    }

    if (!current.parentId) break;

    current = byId.get(current.parentId);

    // A referenced but missing parent is invalid.
    if (!current) return false;
  }

  if (chain.length === 0 || chain[chain.length - 1].type !== "workspace") {
    return false;
  }

  const chainIds = new Set(chain.map((container) => container.id));

  const relevantGrants = context.grants.filter(
    (grant) =>
      grant.userId === userId &&
      grant.permission === permission &&
      chainIds.has(grant.containerId),
  );

  // A deny on the target or any ancestor overrides allows.
  if (relevantGrants.some((grant) => grant.effect === "deny")) {
    return false;
  }

  if (permission === "view") {
    // Every private container in the hierarchy needs its own allow.
    return chain.every((container) => {
      if (container.visibility !== "private") return true;

      return context.grants.some(
        (grant) =>
          grant.userId === userId &&
          grant.containerId === container.id &&
          grant.permission === "view" &&
          grant.effect === "allow",
      );
    });
  }

  // Editing requires an explicit allow on the target or an ancestor.
  return relevantGrants.some((grant) => grant.effect === "allow");
}
