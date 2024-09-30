const { Router } = require("express");
const {
  Signup,
  Login,
  LoginWithGoogle,
} = require("../Controllers/User.controller");
const authentication = require("../Middlewares/Authentication");
const {
  createTask,
  updateTask,
  deleteTask,
  getAllTasks,
  handleUpdateStatus,
} = require("../Controllers/Task.controller");

const AllRoutes = Router();

// User routes
AllRoutes.post("/signup", Signup);
AllRoutes.post("/login", Login);
AllRoutes.post("/googleLogin", LoginWithGoogle);

//Task routes

AllRoutes.post("/addTask", authentication, createTask);
AllRoutes.put("/updateTaskStatus/:taskId", authentication, handleUpdateStatus);
AllRoutes.put("/updatetask/:taskId", authentication, updateTask);
AllRoutes.delete("/deletetask/:taskId", authentication, deleteTask);
AllRoutes.get("/tasks/:userId", authentication, getAllTasks);

module.exports = AllRoutes;
