// app.js

const express = require('express');
const cors = require('cors');
const studentRoutes = require('./routes/studentRoutes');
const marksRoutes = require('./routes/marksRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Default route
app.get('/', (req, res) => {
  res.send('Student API is running');
});

app.use('/students', studentRoutes);
app.use('/marks', marksRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
