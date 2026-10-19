
import { seedData } from "../data/seed";
import {
  canAccessContainer
} from "../lib/permissions";
import {
  selectVisibleContainers,
  selectVisibleTasks,
} from "../lib/selectors";

const bob = "user-bob";
const carol = "user-carol";
const alice = "user-alice";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`FAILED: ${message}`);
  console.log(`PASSED: ${message}`);
}

assert(seedData.tasks.length >= 15, "Seed has at least 15 tasks");

assert(
  canAccessContainer("space-engineering", "view", bob, seedData),
  "Bob can view Engineering",
);

assert(
  !canAccessContainer("space-engineering", "view", carol, seedData),
  "Carol is denied Engineering",
);

assert(
  canAccessContainer("folder-research", "view", bob, seedData),
  "Bob can view private Research",
);

assert(
  !canAccessContainer("folder-research", "view", "unknown-user", seedData),
  "Unknown users have no access",
);

assert(
  canAccessContainer("folder-research", "view", alice, seedData),
  "Alice admin bypasses container permissions",
);

assert(
  selectVisibleTasks(seedData, bob).every((task) =>
    selectVisibleContainers(seedData, bob).some(
      (container) =>
        container.id === task.listId && container.type === "list",
    ),
  ),
  "Visible tasks belong to visible lists",
);

console.log("Permission smoke tests completed.");
