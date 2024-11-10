const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection using environment variable
mongoose.connect(process.env.MONGOURL || "mongodb://localhost:27017/employee-db", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('DB connected'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Employee Schema
const employeeSchema = new mongoose.Schema({
  name: { required: true, type: String },
  type: { required: true, type: String },
  email: { required: true, type: String },
  dob: { required: true, type: String },
  gender: { required: true, type: String },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }] // Array of task IDs
});

// Task Schema
const taskSchema = new mongoose.Schema({
  title: { required: true, type: String },
  description: { required: true, type: String }
});

// Models
const Employee = mongoose.model('Employee', employeeSchema);
const Task = mongoose.model('Task', taskSchema);

// Create Employee
app.post('/employees', async (req, res) => {
  const { name, type, email, dob, gender } = req.body;
  try {
    const newEmployee = new Employee({ name, type, email, dob, gender });
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Get Employees
app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find().populate('tasks'); // Populates tasks details
    res.json(employees);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Update Employee
app.put('/employees/:id', async (req, res) => {
  const { name, type, email, dob, gender } = req.body;
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, type, email, dob, gender },
      { new: true }
    );
    if (!updatedEmployee) return res.status(404).json({ message: "Employee not found" });
    res.json(updatedEmployee);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Delete Employee
app.delete('/employees/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) return res.status(404).json({ message: "Employee not found" });
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Create Task
app.post('/tasks', async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTask = new Task({ title, description });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Get Tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Update Task
app.put('/tasks/:id', async (req, res) => {
  const { title, description } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "An error occurred while updating the task" });
  }
});

// Delete Task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ message: "Task not found" });
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Assign Task to Employee
app.post('/employees/:id/assign-task', async (req, res) => {
  const { taskId } = req.body;
  try {
    const employee = await Employee.findById(req.params.id);
    const task = await Task.findById(taskId);

    if (!employee || !task) {
      return res.status(404).json({ message: "Employee or Task not found" });
    }

    // Add task to employee's task array
    employee.tasks.push(taskId);
    await employee.save();

    res.json({ message: "Task assigned to employee", employee });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Unassign Task from Employee
app.delete('/employees/:id/unassign-task', async (req, res) => {
  const { taskId } = req.body;
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Remove task from employee's task array
    employee.tasks = employee.tasks.filter(task => task.toString() !== taskId);
    await employee.save();

    res.json({ message: "Task unassigned from employee", employee });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("Server is listening on port " + port);
});
