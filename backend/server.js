const express = require('express');
const connectDB = require('./database');
const taskRoutes = require('./routes/tasks'); // Ensure the path is correct
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

// Database connection
connectDB();

// Routes setup
app.use('/api', taskRoutes);

// Root route for basic API check
app.get('/', (req, res) => res.send('API Running'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
