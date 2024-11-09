const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
// MongoDB connection
// Using environment variable
mongoose.connect(process.env.MONGOURL || "mongodb://localhost:27017/employee-db", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('DB connected'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Employee Schema
const employeeSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  type: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  dob: {
    required: true,
    type: String,
  },
  gender: {
    required: true,
    type: String,
  },
});

// Employee Model
const Employee = mongoose.model('Employee', employeeSchema);

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
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Update Employee
app.put('/employees/:id', async (req, res) => {
  try {
    const { name, type, email, dob, gender } = req.body;
    const id = req.params.id;
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { name, type, email, dob, gender },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(updatedEmployee);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Delete Employee
app.delete('/employees/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(204).end();
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