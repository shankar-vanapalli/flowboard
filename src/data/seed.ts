
import type {
  Container,
  FlowboardData,
  PermissionGrant,
  Task,
  TaskStatus,
  User,
} from "../types";

const timestamp = "2026-10-17T09:00:00.000Z";

const containers: Container[] = [
  {
    id: "workspace-1",
    name: "Acme Workspace",
    type: "workspace",
    parentId: null,
    position: 0,
    visibility: "public",
    archivedAt: null,
    deletedAt: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: "space-engineering",
    name: "Engineering",
    type: "space",
    parentId: "workspace-1",
    position: 0,
    visibility: "public",
    archivedAt: null,
    deletedAt: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: "space-design",
    name: "Design",
    type: "space",
    parentId: "workspace-1",
    position: 1,
    visibility: "public",
    archivedAt: null,
    deletedAt: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: "folder-launch",
    name: "Q2 Launch",
    type: "folder",
    parentId: "space-engineering",
    position: 0,
    visibility: "public",
    archivedAt: null,
    deletedAt: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: "folder-research",
    name: "Research",
    type: "folder",
    parentId: "space-design",
    position: 0,
    visibility: "private",
    archivedAt: null,
    deletedAt: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: "list-backlog",
    name: "Backlog",
    type: "list",
    parentId: "folder-launch",
    position: 0,
    visibility: "public",
    archivedAt: null,
    deletedAt: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: "list-sprint",
    name: "Sprint",
    type: "list",
    parentId: "folder-launch",
    position: 1,
    visibility: "public",
    archivedAt: null,
    deletedAt: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: "list-design",
    name: "Design Tasks",
    type: "list",
    parentId: "folder-research",
    position: 0,
    visibility: "public",
    archivedAt: null,
    deletedAt: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  },
];

const users: User[] = [
  {
    id: "user-alice",
    name: "Alice",
    email: "alice@example.com",
    role: "admin",
    avatarColor: "#2563eb",
  },
  {
    id: "user-bob",
    name: "Bob",
    email: "bob@example.com",
    role: "member",
    avatarColor: "#16a34a",
  },
  {
    id: "user-carol",
    name: "Carol",
    email: "carol@example.com",
    role: "member",
    avatarColor: "#9333ea",
  },
];

const statuses: TaskStatus[] = [
  {
    id: "backlog-todo",
    listId: "list-backlog",
    name: "To do",
    category: "not_started",
    position: 0,
  },
  {
    id: "backlog-progress",
    listId: "list-backlog",
    name: "In progress",
    category: "active",
    position: 1,
  },
  {
    id: "backlog-done",
    listId: "list-backlog",
    name: "Done",
    category: "completed",
    position: 2,
  },
  {
    id: "sprint-open",
    listId: "list-sprint",
    name: "Open",
    category: "not_started",
    position: 0,
  },
  {
    id: "sprint-doing",
    listId: "list-sprint",
    name: "Doing",
    category: "active",
    position: 1,
  },
  {
    id: "sprint-finished",
    listId: "list-sprint",
    name: "Finished",
    category: "completed",
    position: 2,
  },
  {
    id: "design-planned",
    listId: "list-design",
    name: "Planned",
    category: "not_started",
    position: 0,
  },
  {
    id: "design-review",
    listId: "list-design",
    name: "In review",
    category: "active",
    position: 1,
  },
  {
    id: "design-approved",
    listId: "list-design",
    name: "Approved",
    category: "completed",
    position: 2,
  },
];

const taskTitles = [
  "Set up project structure",
  "Define API contracts",
  "Review authentication flow",
  "Improve dashboard loading",
  "Add error boundaries",
  "Create task filters",
  "Build reusable form fields",
  "Add keyboard navigation",
  "Review accessibility",
  "Write integration tests",
  "Improve empty states",
  "Audit loading indicators",
  "Document component patterns",
  "Review responsive layouts",
  "Prepare release checklist",
];

const tasks: Task[] = taskTitles.map((title, index) => {
  const listIndex = Math.floor(index / 5);
  const listIds = [
    "list-backlog",
    "list-sprint",
    "list-design",
  ];
  const statusIds = [
    ["backlog-todo", "backlog-progress", "backlog-done"],
    ["sprint-open", "sprint-doing", "sprint-finished"],
    ["design-planned", "design-review", "design-approved"],
  ];

  return {
    id: `task-${index + 1}`,
    listId: listIds[listIndex],
    title,
    description: `Work on ${title.toLowerCase()} and document the outcome.`,
    statusId: statusIds[listIndex][index % 3],
    priority: (["normal", "high", "low", "urgent", "normal"] as const)[
      index % 5
    ],
    assigneeIds: [
      ["user-bob", "user-carol", "user-alice"][index % 3],
    ],
    dueDate: index % 4 === 0 ? null : `2026-10-${20 + (index % 10)}`,
    position: index % 5,
    createdAt: timestamp,
    updatedAt: timestamp,
    archivedAt: null,
    deletedAt: null,
  };
});

const grants: PermissionGrant[] = [
  // Bob can access the private research area.
  {
    id: "grant-bob-research-view",
    containerId: "folder-research",
    userId: "user-bob",
    permission: "view",
    effect: "allow",
  },
  {
    id: "grant-bob-research-edit",
    containerId: "folder-research",
    userId: "user-bob",
    permission: "edit",
    effect: "allow",
  },
  // Carol is explicitly denied access to the Engineering space.
  {
    id: "grant-carol-engineering-deny",
    containerId: "space-engineering",
    userId: "user-carol",
    permission: "view",
    effect: "deny",
  },
  // Carol can access the private research folder.
  {
    id: "grant-carol-research-view",
    containerId: "folder-research",
    userId: "user-carol",
    permission: "view",
    effect: "allow",
  },
  {
    id: "grant-bob-design-view",
    containerId: "list-design",
    userId: "user-bob",
    permission: "view",
    effect: "allow",
  },
  {
    id: "grant-bob-design-edit",
    containerId: "list-design",
    userId: "user-bob",
    permission: "edit",
    effect: "allow",
  },
  {
    id: "grant-carol-design-view",
    containerId: "list-design",
    userId: "user-carol",
    permission: "view",
    effect: "allow",
  },
];

export const seedData: FlowboardData = {
  containers,
  tasks,
  statuses,
  users,
  grants,
};
