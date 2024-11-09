const express = require('express');
const Employee = require('../models/Employee');
const router = express.Router();

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add a new employee
router.post('/', async (req, res) => {
  const { name, email, type, dob, gender } = req.body;
  try {
    const newEmployee = new Employee({ name, email, type, dob, gender });
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).json({ message: 'Error adding employee', error: error.message });
  }
});

// Update an employee
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, type, dob, gender } = req.body;
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { name, email, type, dob, gender },
      { new: true }
    );
    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: 'Error updating employee', error: error.message });
  }
});

// Delete an employee
router.delete('/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
