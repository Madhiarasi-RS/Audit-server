const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// CRUD operations for employees
router.post('/', employeeController.createEmployee);
router.get('/', employeeController.getEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

// Route to handle attendance updates
router.put('/:employeeId/attendance', (req, res) => {
  const { employeeId } = req.params;
  
  if (req.body.increase) {
    return employeeController.increaseAttendance(employeeId, res);
  } else if (req.body.decrease) {
    return employeeController.decreaseAttendance(employeeId, res);
  } else {
    return res.status(400).json({ message: 'Invalid request, please specify "increase" or "decrease" in the body.' });
  }
});

module.exports = router;
