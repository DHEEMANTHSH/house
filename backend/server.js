const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const connectDB = require('./config/db');
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/properties', require('./routes/properties'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});