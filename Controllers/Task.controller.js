const { tasks } = require("../Models"); // Adjust the import based on your setup
require("dotenv").config();
const jwt = require("jsonwebtoken");

// Create a new task
const createTask = async (req, res) => {
  const payload = req.body;
  try {
    if (
      !payload.title ||
      !payload.description ||
      payload.description.length > 300
    ) {
      return res.status(400).json({ msg: "Invalid content" });
    }
    const newTask = await tasks.create({
      ...payload,
      userID: req.user.userId, // Adjust this if your model has a different user identifier
    });

    res.status(201).json({ msg: "Task created successfully", task: newTask });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong", error: err.message });
  }
};

// Update the task
const updateTask = async (req, res) => {
  const id = req.params.taskId;
  console.log("Incoming request body:", req.body);

  const { title, description, taskdetails } = req.body;
  try {
    if (!title || !description || !taskdetails) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const task = await tasks.findByPk(id); // Use findByPk for primary key lookup
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    const updatedTask = await task.update({
      title,
      description,
      taskdetails,
      updatedAt: new Date(), // Ensure your model has updatedAt
    });

    res
      .status(200)
      .json({ msg: "Task updated successfully", task: updatedTask });
  } catch (err) {
    console.error("Error updating task:", err.message);
    res.status(500).json({ msg: "Something went wrong", error: err.message });
  }
};

// Delete a task by id
const deleteTask = async (req, res) => {
  const id = req.params.taskId;

  try {
    const task = await tasks.findByPk(id); // Use findByPk for primary key lookup
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    await task.destroy(); // Use destroy method for deletion

    res.status(200).json({ msg: "Deleted task successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong", error: err.message });
  }
};

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const userId = req.params.userId;
    const allTasks = await tasks.findAll({ where: { userID: userId } }); // Use findAll to retrieve all records
    res.status(200).json({ msg: "All tasks", data: allTasks });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong", error: err.message });
  }
};

// Handle updating task status
const handleUpdateStatus = async (req, res) => {
  try {
    const id = req.params.taskId;
    const { status } = req.body;

    const task = await tasks.findByPk(id);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    const updatedTask = await task.update({
      status,
      updatedAt: new Date(),
    });

    res
      .status(200)
      .json({ msg: "Task updated successfully", task: updatedTask });
  } catch (err) {
    console.error("Error updating task status:", err.message);
    res.status(500).json({ msg: "Something went wrong", error: err.message });
  }
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getAllTasks,
  handleUpdateStatus,
};
