export type ID = string;

export type ContainerType = 
    | "workspace"
    | "space"
    | "folder"
    | "list";

export type Visibility = "public" | "private";

export type UserRole = "admin" | "member";

export type StatusCategory = 
    | "not_started"
    | "active"
    | "completed";

export type Priority = 
    | "urgent"
    | "high"
    | "normal"
    | "low";

export type Permission = "view" | "edit";

export type GrantEffect = "allow" | "deny";

export interface Container {
    id: ID;
    type: ContainerType;
    name: string;
    parentId?: ID | null;
    position: number;
    visibility: Visibility;
    archivedAt: string | null;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface TaskStatus {
    id: ID;
    listId: ID;
    name: string;
    category: StatusCategory;
    position: number;
}


export interface Task {
  id: ID;
  listId: ID;
  title: string;
  description: string;
  statusId: ID;
  priority: Priority;
  assigneeIds: ID[];
  dueDate: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
  deletedAt: string | null;
}

export interface User {
  id: ID;
  name: string;
  email: string;
  role: UserRole;
  avatarColor: string;
}

export interface PermissionGrant {
  id: ID;
  containerId: ID;
  userId: ID;
  permission: Permission;
  effect: GrantEffect;
}

export interface FlowboardData {
  containers: Container[];
  tasks: Task[];
  statuses: TaskStatus[];
  users: User[];
  grants: PermissionGrant[];
}