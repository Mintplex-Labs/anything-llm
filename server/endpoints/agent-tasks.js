const express = require("express");
const router = express.Router();
const { saveTask, loadTask, listTasks } = require("../utils/agents/aibitat/plugins/agent-task-executor");
const { AgentHandler } = require("../utils/agents");

router.post("/agent-task/save", async (req, res) => {
  try {
    const { name, config } = req.body;
    if (!name || !config) {
      return res.status(400).json({
        success: false,
        error: "Name and config are required"
      });
    }

    const saved = await saveTask(name, config);
    if (!saved) {
      return res.status(500).json({
        success: false,
        error: "Failed to save task"
      });
    }

    return res.status(200).json({
      success: true,
      task: { name, config }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get("/agent-task/list", async (req, res) => {
  try {
    const tasks = await listTasks();
    return res.status(200).json({
      success: true,
      tasks
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get("/agent-task/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const task = await loadTask(name);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found"
      });
    }

    return res.status(200).json({
      success: true,
      task: { name, config: task }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post("/agent-task/:name/run", async (req, res) => {
  try {
    const { name } = req.params;
    const { variables = {} } = req.body;

    const agentHandler = new AgentHandler();
    const results = await agentHandler.aibitat.executeFunction("executeAgentTask", {
      taskName: name,
      variables
    });

    return res.status(200).json({
      success: true,
      results: JSON.parse(results)
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
