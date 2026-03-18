const express    = require('express');
const cors       = require('cors');
const mongoose   = require('mongoose');
require('dotenv').config();

require('./models/User');
require('./models/Employee');

const authRoutes     = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',      authRoutes);
app.use('/api/employees', employeeRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ClearMind API is running!' });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected!');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log('❌ Error:', err.message);
  });