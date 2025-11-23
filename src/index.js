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

app.use(
  cors({
    origin: 'http://localhost:5173', 
    credentials: false,
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'HRMS API running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/teams', teamRoutes);

// central error handler
app.use(errorHandler);

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
