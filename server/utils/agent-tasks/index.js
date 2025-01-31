const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const TASKS_DIR = process.env.STORAGE_DIR
  ? path.join(process.env.STORAGE_DIR, "plugins", "agent-tasks")
  : path.join(process.cwd(), "storage", "plugins", "agent-tasks");

// Ensure tasks directory exists
async function ensureTasksDir() {
  try {
    await fs.mkdir(TASKS_DIR, { recursive: true });
  } catch (error) {
    console.error("Failed to create tasks directory:", error);
  }
}

// Helper to get all task files with their contents
async function getAllTasks() {
  const files = await fs.readdir(TASKS_DIR);
  const tasks = {};

  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    try {
      const content = await fs.readFile(path.join(TASKS_DIR, file), "utf8");
      const config = JSON.parse(content);
      const id = file.replace(".json", "");
      tasks[id] = config;
    } catch (error) {
      console.error(`Error reading task file ${file}:`, error);
    }
  }

  return tasks;
}

// Load a task configuration by UUID
async function loadTask(uuid) {
  try {
    const tasks = await getAllTasks();
    const task = tasks[uuid];
    if (!task) return null;

    return {
      name: task.name,
      uuid,
      config: task,
    };
  } catch (error) {
    console.error("Failed to load task:", error);
    return null;
  }
}

// Save a task configuration
async function saveTask(name, config, uuid = null) {
  try {
    await ensureTasksDir();

    // Generate new UUID if not provided
    if (!uuid) {
      uuid = uuidv4();
    }

    const filename = path.join(TASKS_DIR, `${uuid}.json`);
    await fs.writeFile(filename, JSON.stringify({ ...config, name }, null, 2));
    return { success: true, uuid };
  } catch (error) {
    console.error("Failed to save task:", error);
    return { success: false };
  }
}

// List all available tasks
async function listTasks() {
  try {
    const tasks = await getAllTasks();
    return Object.entries(tasks).map(([uuid, task]) => ({
      name: task.name,
      uuid,
      description: task.description,
    }));
  } catch (error) {
    console.error("Failed to list tasks:", error);
    return [];
  }
}

// Delete a task by UUID
async function deleteTask(uuid) {
  try {
    const filename = path.join(TASKS_DIR, `${uuid}.json`);
    await fs.unlink(filename);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete task:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  loadTask,
  saveTask,
  listTasks,
  deleteTask,
};
