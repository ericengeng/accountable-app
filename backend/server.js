const express = require('express');
const connectDB = require('./database');
const taskRoutes = require('./routes/tasks');
const friendRoutes = require('./routes/friends');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const admin = require('firebase-admin');
require('dotenv').config();
const User = require('./models/User');

process.env.GOOGLE_APPLICATION_CREDENTIALS = './serviceAccountKey.json'; // Update the path accordingly


admin.initializeApp({
  credential: admin.credential.cert(require(process.env.GOOGLE_APPLICATION_CREDENTIALS)),
});

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

connectDB();


app.use('/api/users', taskRoutes);
app.use('/api/friends', friendRoutes);


app.get('/', (req, res) => res.send('API Running'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
