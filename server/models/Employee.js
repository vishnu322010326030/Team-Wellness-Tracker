const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },

  // HR entered data
  consecutiveDaysWorked: {
    type: Number,
    default: 0
  },
  performanceScore: {
    type: Number,
    default: 100
  },
  overtimeHoursPerWeek: {
    type: Number,
    default: 0
  },
  leaveDaysTaken: {
    type: Number,
    default: 0
  },
  deadlinePressure: {
    type: Number,
    enum: [1, 2, 3],
    default: 1
  },

  // Employee entered data
  meetingsPerWeek: {
    type: Number,
    default: 0
  },
  presentationsPerWeek: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  },

  // Calculated by system
  wellnessScore: {
    type: Number,
    default: 100
  },
  riskLevel: {
    type: String,
    enum: ['healthy', 'moderate', 'high', 'critical'],
    default: 'healthy'
  }

}, { timestamps: true });

// Auto calculate wellness score before saving
employeeSchema.pre('save', async function() {
  const risk =
    (this.consecutiveDaysWorked * 2) +
    (this.overtimeHoursPerWeek * 1.5) +
    (this.deadlinePressure * 8) -
    (this.leaveDaysTaken * 5) -
    (this.performanceScore * 0.1);

  this.wellnessScore = Math.max(0, Math.min(100, Math.round(100 - risk)));

  if      (this.wellnessScore < 25) this.riskLevel = 'critical';
  else if (this.wellnessScore < 40) this.riskLevel = 'high';
  else if (this.wellnessScore < 65) this.riskLevel = 'moderate';
  else                               this.riskLevel = 'healthy';
});
module.exports = mongoose.model('Employee', employeeSchema);