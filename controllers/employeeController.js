const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const Task = require('../models/Task');

// Create Employee
exports.createEmployee = async (req, res) => {
  const { name, type, email, dob, gender } = req.body;
  try {
    const newEmployee = new Employee({ name, type, email, dob, gender });
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get All Employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get Employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('tasks');
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Update Employee
exports.updateEmployee = async (req, res) => {
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
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Delete Employee
exports.deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) return res.status(404).json({ message: "Employee not found" });
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Mark Attendance
exports.markAttendance = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    employee.attendance += 1;
    await employee.save();

    const newAttendance = new Attendance({ employeeId: employee._id, status: 'Present' });
    await newAttendance.save();

    res.json({ message: "Attendance marked", employee });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Failed to mark attendance" });
  }
};
