
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderKanban,
  List,
} from "lucide-react";

import type { Container, ID } from "../../types";

interface WorkspaceTreeProps {
  containers: Container[];
  selectedListId: ID | null;
  expandedContainerIds: ID[];
  onSelectList: (listId: ID) => void;
  onToggleContainer: (containerId: ID) => void;
}

interface TreeItemProps extends WorkspaceTreeProps {
  container: Container;
  depth: number;
}

function ContainerIcon({
  type,
  className,
  size = 17,
}: {
  type: Container["type"];
  className?: string;
  size?: number;
}) {
  switch (type) {
    case "space":
      return <FolderKanban size={size} className={className} />;
    case "folder":
      return <Folder size={size} className={className} />;
    case "list":
      return <List size={size} className={className} />;
    default:
      return <Folder size={size} className={className} />;
  }
}

function TreeItem({
  container,
  containers,
  selectedListId,
  expandedContainerIds,
  onSelectList,
  onToggleContainer,
  depth,
}: TreeItemProps) {
  const children = containers
    .filter((item) => item.parentId === container.id)
    .sort((a, b) => a.position - b.position);

  const hasChildren = children.length > 0;
  const isExpanded = expandedContainerIds.includes(container.id);
  const isSelected = selectedListId === container.id;

  function handleClick() {
    if (container.type === "list") {
      onSelectList(container.id);
      return;
    }

    if (!isExpanded) {
      onToggleContainer(container.id);
    }

    // Find the first descendant list under this container
    const findFirstList = (parentId: ID): Container | undefined => {
      const directChildren = containers
        .filter((c) => c.parentId === parentId)
        .sort((a, b) => a.position - b.position);
      for (const child of directChildren) {
        if (child.type === "list") return child;
        const nested = findFirstList(child.id);
        if (nested) return nested;
      }
      return undefined;
    };

    const firstList = findFirstList(container.id);
    if (firstList) {
      onSelectList(firstList.id);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        aria-expanded={
          hasChildren ? isExpanded : undefined
        }
        aria-current={isSelected ? "page" : undefined}
        className={[
          "flex w-full min-w-0 items-center gap-2 rounded-control",
          "py-2 pr-2 text-left text-sm transition-colors",
          "hover:bg-canvas",
          isSelected
            ? "bg-brand-50 font-medium text-brand-700"
            : "text-text-secondary hover:text-text-primary",
        ].join(" ")}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        {hasChildren ? (
          <span
            role="button"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation();
              onToggleContainer(container.id);
            }}
            className="flex items-center justify-center rounded p-0.5 hover:bg-slate-200/60"
          >
            {isExpanded ? (
              <ChevronDown
                size={14}
                className="shrink-0 text-text-muted"
              />
            ) : (
              <ChevronRight
                size={14}
                className="shrink-0 text-text-muted"
              />
            )}
          </span>
        ) : (
          <span className="w-[14px] shrink-0" />
        )}

        <ContainerIcon
          type={container.type}
          size={17}
          className={
            isSelected
              ? "shrink-0 text-brand-600"
              : "shrink-0 text-text-secondary"
          }
        />

        <span className="min-w-0 flex-1 truncate">
          {container.name}
        </span>
      </button>

      {hasChildren && isExpanded && (
        <div>
          {children.map((child) => (
            <TreeItem
              key={child.id}
              container={child}
              containers={containers}
              selectedListId={selectedListId}
              expandedContainerIds={expandedContainerIds}
              onSelectList={onSelectList}
              onToggleContainer={onToggleContainer}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function WorkspaceTree({
  containers,
  selectedListId,
  expandedContainerIds,
  onSelectList,
  onToggleContainer,
}: WorkspaceTreeProps) {
  const spaces = containers
    .filter(
      (container) =>
        container.type === "space" &&
        container.parentId === "workspace-1",
    )
    .sort((a, b) => a.position - b.position);

  return (
    <div className="space-y-1">
      {spaces.map((space) => (
        <TreeItem
          key={space.id}
          container={space}
          containers={containers}
          selectedListId={selectedListId}
          expandedContainerIds={expandedContainerIds}
          onSelectList={onSelectList}
          onToggleContainer={onToggleContainer}
          depth={0}
        />
      ))}
    </div>
  );
}
