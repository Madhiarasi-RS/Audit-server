const Task = require('../models/Task');
const Employee = require('../models/Employee');

// Create Task
exports.createTask = async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTask = new Task({ title, description });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get All Tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status },
      { new: true }
    );
    if (!updatedTask) return res.status(404).json({ message: "Task not found" });
    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Failed to update task" });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ message: "Task not found" });
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Assign Task
exports.assignTask = async (req, res) => {
  const { taskId } = req.body;
  try {
    const employee = await Employee.findById(req.params.id);
    const task = await Task.findById(taskId);

    if (!employee || !task) return res.status(404).json({ message: "Employee or Task not found" });

    task.assignedTo = employee._id;
    await task.save();

    employee.tasks.push(taskId);
    await employee.save();

    res.json({ message: "Task assigned", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
