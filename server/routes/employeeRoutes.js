const express = require('express');
const {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  logActivity
} = require('../controllers/employeeController');

const { protect, hrOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// HR only routes
router.get('/',          protect, hrOnly, getAllEmployees);
router.post('/',         protect, hrOnly, createEmployee);
router.put('/:id',       protect, hrOnly, updateEmployee);
router.delete('/:id',    protect, hrOnly, deleteEmployee);

// Any logged in user
router.get('/:id',       protect, getEmployee);
router.put('/:id/log',   protect, logActivity);

module.exports = router;