const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const connectDB = require('./config/db');
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

// API Routes
app.use('/api/properties', require('./routes/properties'));

// Serve static frontend files from the sibling frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Fallback to index.html for frontend routing if needed
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});