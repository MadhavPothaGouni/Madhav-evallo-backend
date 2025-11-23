const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const { sequelize } = require('./db');
const { errorHandler } = require('./middlewares/errorHandler');

const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const teamRoutes = require('./routes/teams');

const app = express();

/**
 * TEMP CORS CONFIG (Frontend not deployed yet)
 * Allow all origins during backend testing & Render deployment
 */
app.use(
  cors({
    origin: '*',
    credentials: false
  })
);

// Body parser
app.use(express.json());

// Health route
app.get('/', (req, res) => {
  res.json({ message: 'HRMS API running' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/teams', teamRoutes);

// Error handler
app.use(errorHandler);

// Server start
const PORT = process.env.PORT || 5000;

sequelize
  .sync()
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to sync DB:', err);
  });
