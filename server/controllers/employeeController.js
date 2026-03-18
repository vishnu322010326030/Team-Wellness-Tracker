const Employee = require('../models/Employee');

// ── GET ALL EMPLOYEES ──
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── GET SINGLE EMPLOYEE ──
const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── CREATE EMPLOYEE ──
const createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      department,
      role,
      consecutiveDaysWorked,
      performanceScore,
      overtimeHoursPerWeek,
      leaveDaysTaken,
      deadlinePressure
    } = req.body;

    // Check if employee already exists
    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Employee already exists' });
    }

    const employee = await Employee.create({
      name,
      email,
      department,
      role,
      consecutiveDaysWorked,
      performanceScore,
      overtimeHoursPerWeek,
      leaveDaysTaken,
      deadlinePressure
    });

    res.status(201).json({
      message: 'Employee created successfully',
      employee
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── UPDATE EMPLOYEE (HR enters work data) ──
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Update fields
    const fields = [
      'consecutiveDaysWorked',
      'performanceScore',
      'overtimeHoursPerWeek',
      'leaveDaysTaken',
      'deadlinePressure',
      'meetingsPerWeek',
      'presentationsPerWeek',
      'notes'
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        employee[field] = req.body[field];
      }
    });

    // Save triggers the pre-save hook
    // which auto-recalculates wellness score
    await employee.save();

    res.status(200).json({
      message: 'Employee updated successfully',
      employee
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── DELETE EMPLOYEE ──
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── EMPLOYEE LOGS OWN ACTIVITY ──
const logActivity = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const { meetingsPerWeek, presentationsPerWeek, notes } = req.body;

    if (meetingsPerWeek      !== undefined) employee.meetingsPerWeek      = meetingsPerWeek;
    if (presentationsPerWeek !== undefined) employee.presentationsPerWeek = presentationsPerWeek;
    if (notes                !== undefined) employee.notes                = notes;

    await employee.save();

    res.status(200).json({
      message: 'Activity logged successfully',
      employee
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  logActivity
};