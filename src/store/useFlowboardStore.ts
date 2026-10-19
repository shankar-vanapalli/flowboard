
import { create } from "zustand";

import { seedData } from "../data/seed";
import { canAccessContainer, PermissionError } from "../lib/permissions";
import type {
  FlowboardData,
  ID,
  Task,
} from "../types";

// ---------------------------------------------------------------------------
// moveTask types
// ---------------------------------------------------------------------------

export type MoveTaskInput = {
  taskId: string;
  targetStatusId: string;
  targetPosition: number;
};

export type MoveTaskResult =
  | { success: true }
  | { success: false; error: { code: string; message: string } };

interface FlowboardState extends FlowboardData {
  activeUserId: ID;

  selectedListId: ID | null;
  expandedContainerIds: ID[];
  createTask: (listId: ID, title: string) => ID;
  deleteTask: (taskId: ID) => void;
  selectList: (listId: ID) => void;
  toggleContainer: (containerId: ID) => void;
  setActiveUser: (userId: ID) => void;
  moveTask: (input: MoveTaskInput) => MoveTaskResult;
  updateTask: (taskId: ID, updates: Partial<Task>) => void;
  resetData: () => void;
}

export const useFlowboardStore = create<FlowboardState>()((set, get) => ({
  ...structuredClone(seedData),

  // Start as Alice so the initial UI can show all seeded data.
  activeUserId: "user-alice",


  selectedListId: "list-backlog",
  expandedContainerIds: [
    "space-engineering",
    "folder-launch",
    "space-design",
    "folder-research",
  ],

  selectList: (listId) => {
     const state = get();

  const list = state.containers.find(
    (container) =>
      container.id === listId &&
      container.type === "list",
  );

  if (!list) {
    throw new Error(`List not found: ${listId}`);
  }

  const canView = canAccessContainer(
    listId,
    "view",
    state.activeUserId,
    state,
  );

  if (!canView) {
    throw new PermissionError(
      "You do not have access to this list.",
    );
  }

  set({ selectedListId: listId });
  },
  
  toggleContainer: (containerId) => {
    const state = get();
  const isExpanded =
    state.expandedContainerIds.includes(containerId);

  set({
    expandedContainerIds: isExpanded
      ? state.expandedContainerIds.filter(
          (id) => id !== containerId,
        )
      : [...state.expandedContainerIds, containerId],
  });
  },
  setActiveUser: (userId) => {
    const state = get();
    const exists = state.users.some((user) => user.id === userId);

    if (!exists) {
      throw new Error(`Unknown user: ${userId}`);
    }

    let newSelectedListId = state.selectedListId;
    if (newSelectedListId) {
      const canView = canAccessContainer(
        newSelectedListId,
        "view",
        userId,
        state,
      );
      if (!canView) {
        const firstAllowed = state.containers.find(
          (c) =>
            c.type === "list" &&
            !c.deletedAt &&
            !c.archivedAt &&
            canAccessContainer(c.id, "view", userId, state),
        );
        newSelectedListId = firstAllowed ? firstAllowed.id : null;
      }
    }

    set({ activeUserId: userId, selectedListId: newSelectedListId });
  },

  updateTask: (taskId, updates) => {
    const state = get();
    const task = state.tasks.find((item) => item.id === taskId);

    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    const allowedUpdates: Partial<Task> = {};

    if (updates.title !== undefined) {
  allowedUpdates.title = updates.title;
}

if (updates.description !== undefined) {
  allowedUpdates.description = updates.description;
}

if (updates.statusId !== undefined) {
  allowedUpdates.statusId = updates.statusId;
}

if (updates.priority !== undefined) {
  allowedUpdates.priority = updates.priority;
}

if (updates.assigneeIds !== undefined) {
  allowedUpdates.assigneeIds = updates.assigneeIds;
}

if (updates.dueDate !== undefined) {
  allowedUpdates.dueDate = updates.dueDate;
}

if (updates.position !== undefined) {
  allowedUpdates.position = updates.position;
}

    const permitted = canAccessContainer(
      task.listId,
      "edit",
      state.activeUserId,
      state,
    );

    if (!permitted) {
      throw new PermissionError(
        `You cannot edit task "${task.title}".`,
      );
    }

    let positionUpdates: Record<string, number> = {};

    if (updates.statusId !== undefined) {
      const status = state.statuses.find(
        (item) => item.id === updates.statusId,
      );

      if (!status || status.listId !== task.listId) {
        throw new Error(
          "The selected status does not belong to this task's list.",
        );
      }

      if (updates.statusId !== task.statusId && updates.position === undefined) {
        const targetColumnTasks = state.tasks
          .filter(
            (item) =>
              item.listId === task.listId &&
              item.statusId === updates.statusId &&
              item.id !== taskId &&
              !item.deletedAt &&
              !item.archivedAt,
          )
          .sort((a, b) => a.position - b.position);

        allowedUpdates.position = targetColumnTasks.length;

        const sourceColumnTasks = state.tasks
          .filter(
            (item) =>
              item.listId === task.listId &&
              item.statusId === task.statusId &&
              item.id !== taskId &&
              !item.deletedAt &&
              !item.archivedAt,
          )
          .sort((a, b) => a.position - b.position);

        sourceColumnTasks.forEach((item, index) => {
          positionUpdates[item.id] = index;
        });
      }
    }

    set({
      tasks: state.tasks.map((item) => {
        if (item.id === taskId) {
          return {
            ...item,
            ...allowedUpdates,
            id: item.id,
            listId: item.listId,
            createdAt: item.createdAt,
            updatedAt: new Date().toISOString(),
          };
        }
        if (positionUpdates[item.id] !== undefined) {
          return {
            ...item,
            position: positionUpdates[item.id],
          };
        }
        return item;
      }),
    });
  },

  createTask: (listId, title) => {
    const state = get();

    const list = state.containers.find(
      (container) =>
        container.id === listId &&
        container.type === "list",
    );

    if (!list) {
      throw new Error(`List not found: ${listId}`);
    }

    if (
      !canAccessContainer(
        listId,
        "edit",
        state.activeUserId,
        state,
      )
    ) {
      throw new PermissionError(
        "You do not have permission to create tasks in this list.",
      );
    }

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      throw new Error("Task title cannot be empty.");
    }

    const now = new Date().toISOString();
    const listTasks = state.tasks.filter(
      (task) =>
        task.listId === listId &&
        !task.deletedAt &&
        !task.archivedAt,
    );

    const firstStatus = state.statuses
      .filter((status) => status.listId === listId)
      .sort((a, b) => a.position - b.position)[0];

    if (!firstStatus) {
      throw new Error("This list does not have any statuses.");
    }

    const id = crypto.randomUUID();

    const newTask: Task = {
      id,
      listId,
      title: normalizedTitle,
      description: "",
      statusId: firstStatus.id,
      priority: "normal",
      assigneeIds: [],
      dueDate: null,
      position: listTasks.length,
      createdAt: now,
      updatedAt: now,
      archivedAt: null,
      deletedAt: null,
    };

    set({ tasks: [...state.tasks, newTask] });

    return id;
  },

  deleteTask: (taskId) => {
    const state = get();
    const task = state.tasks.find((item) => item.id === taskId);

    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    if (
      !canAccessContainer(
        task.listId,
        "edit",
        state.activeUserId,
        state,
      )
    ) {
      throw new PermissionError(
        "You do not have permission to delete this task.",
      );
    }

    const now = new Date().toISOString();

    set({
      tasks: state.tasks.map((item) =>
        item.id === taskId
          ? { ...item, deletedAt: now, updatedAt: now }
          : item,
      ),
    });
  },

  moveTask: ({ taskId, targetStatusId, targetPosition }) => {
    let result: MoveTaskResult = {
      success: false,
      error: { code: "MOVE_FAILED", message: "Unable to move task." },
    };

    set((state) => {
      const task = state.tasks.find((item) => item.id === taskId);
      const targetStatus = state.statuses.find(
        (status) => status.id === targetStatusId,
      );

      if (!task || !targetStatus) {
        result = {
          success: false,
          error: { code: "NOT_FOUND", message: "Task or target status was not found." },
        };
        return state;
      }

      // Status must belong to the same list as the task.
      if (targetStatus.listId !== task.listId) {
        result = {
          success: false,
          error: { code: "INVALID_STATUS", message: "Target status belongs to another list." },
        };
        return state;
      }

      // Permission check — must be able to edit the task's list.
      const permitted = canAccessContainer(
        task.listId,
        "edit",
        state.activeUserId,
        state,
      );

      if (!permitted) {
        result = {
          success: false,
          error: { code: "FORBIDDEN", message: "You do not have permission to move this task." },
        };
        return state;
      }

      const sourceStatusId = task.statusId;
      const isSameColumn = sourceStatusId === targetStatusId;

      // Source column tasks for this list, excluding the moving task.
      const sourceTasks = state.tasks
        .filter(
          (item) =>
            item.listId === task.listId &&
            item.statusId === sourceStatusId &&
            !item.deletedAt &&
            !item.archivedAt,
        )
        .sort((a, b) => a.position - b.position);

      const sourceWithoutTask = sourceTasks.filter(
        (item) => item.id !== taskId,
      );

      // Destination column tasks (without the moving task).
      const destinationTasks = isSameColumn
        ? sourceWithoutTask
        : state.tasks
            .filter(
              (item) =>
                item.listId === task.listId &&
                item.statusId === targetStatusId &&
                !item.deletedAt &&
                !item.archivedAt,
            )
            .sort((a, b) => a.position - b.position);

      const insertionIndex = Math.max(
        0,
        Math.min(Math.floor(targetPosition), destinationTasks.length),
      );

      // Insert task into destination at the requested index.
      const movedTask = { ...task, statusId: targetStatusId };
      const nextDestination = [...destinationTasks];
      nextDestination.splice(insertionIndex, 0, movedTask);

      // Build a map of id → { statusId, position } for all affected tasks.
      const positionUpdates = new Map<string, { statusId: string; position: number }>();

      if (!isSameColumn) {
        // Re-index source column after removal.
        sourceWithoutTask.forEach((item, position) => {
          positionUpdates.set(item.id, { statusId: sourceStatusId, position });
        });
      }

      // Re-index destination column (includes the moved task).
      nextDestination.forEach((item, position) => {
        positionUpdates.set(item.id, { statusId: targetStatusId, position });
      });

      result = { success: true };

      return {
        ...state,
        tasks: state.tasks.map((item) => {
          const update = positionUpdates.get(item.id);
          return update
            ? { ...item, statusId: update.statusId, position: update.position, updatedAt: new Date().toISOString() }
            : item;
        }),
      };
    });

    return result;
  },

  resetData: () => {
    set({
    ...structuredClone(seedData),
    activeUserId: "user-alice",
    selectedListId: "list-backlog",
    expandedContainerIds: [
      "space-engineering",
      "folder-launch",
    ],
  });
  },
}));
