# Flowboard

A modern, hierarchical task management application inspired by ClickUp and Linear, featuring interactive Kanban boards, role-based access control, and intuitive drag-and-drop workflow management.

---

## Features

- **Interactive Kanban Board**: Drag-and-drop tasks between status columns and reorder cards within a column with smooth `@dnd-kit` interactions.
- **Multiple Views**: Seamlessly switch between **Board** (Kanban) and **List** views.
- **Hierarchical Navigation**: Organized into `Workspace → Space → Folder → List` structure with expandable sidebar navigation.
- **Task Management**:
  - Create tasks into lists (tasks start in the default initial status).
  - Open task details drawer to update title, description, status, and priority in real-time.
  - Delete tasks with immediate UI updates.
- **Role-Based Access Control & Permissions**:
  - Hierarchical permission inheritance with explicit `allow` and `deny` overrides.
  - Private container support.
  - Built-in **User Switcher** in the top bar to easily test roles:
    - **Alice (Admin)**: Full access across all workspaces, spaces, and tasks.
    - **Bob (Member)**: Standard permissions with access to private Research.
    - **Carol (Member)**: Explicitly denied access to Engineering; has access to Research.
- **Toast Notifications**: Clean feedback for task creations, saves, moves, and permission violations.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand.docs.pmnd.rs/)
- **Drag & Drop**: [@dnd-kit/core](https://dndkit.com/) & [@dnd-kit/sortable](https://dndkit.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## Getting Started

### Prerequisites

Ensure you have **Node.js** (v18 or higher) and **npm** installed.

### Installation

Clone the repository and install dependencies:

```bash
cd flowboard
npm install
```

### Running Locally

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Type-Checking & Production Build

To run the TypeScript type check and build for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## Project Structure

```text
flowboard/
├── src/
│   ├── components/
│   │   ├── layout/       # AppSidebar, TopBar, WorkspaceTree
│   │   └── ui/           # Toast notification system
│   ├── data/             # Initial seed data and permission grants
│   ├── features/
│   │   └── tasks/        # TaskBoard, TaskColumn, SortableTaskCard, TaskDetailDrawer, TaskListView
│   ├── lib/              # Permission logic, container pathing, selectors
│   ├── store/            # Zustand store (useFlowboardStore)
│   ├── types/            # Data models and TypeScript definitions
│   ├── App.tsx           # Main application container
│   └── main.tsx          # Application entry point
├── package.json
└── vite.config.ts
```

---

## Permissions Quick Test Guide

Use the user switcher dropdown in the top right to verify access controls:

| User      | Role   | Expected Behavior                                                                   |
| --------- | ------ | ----------------------------------------------------------------------------------- |
| **Alice** | Admin  | Can view and edit all spaces, folders, and lists.                                   |
| **Bob**   | Member | Can view Engineering and has view/edit access to the private Research folder.       |
| **Carol** | Member | Explicitly denied access to Engineering; automatically routed to Design / Research. |
