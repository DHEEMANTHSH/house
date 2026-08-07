const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

dotenv.config();

const connectDB = require('./config/db');
connectDB();

// Import Company model for database authentication lookup
const Company = require('./models/Company');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Setup Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'house-properties',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage: storage });

const app = express();

// Increase payload limits to allow multiple image uploads without dropping connection
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ limit: '5000mb', extended: true }));

app.use(cors());

// Make upload middleware accessible if needed
app.locals.upload = upload;

// Company Login Endpoint connected directly to the companies collection
app.post('/api/company/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Directly query the native MongoDB 'companies' collection
    const db = mongoose.connection.db;
    const company = await db.collection('companies').findOne({ 
      $or: [{ email: username }, { companyName: username }, { username: username }] 
    });

    if (!company || company.password !== password) {
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }

    res.json({ success: true, token: 'company-auth-token-xyz' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Company Register Endpoint forcing records directly into the 'companies' collection
app.post('/api/company/register', async (req, res) => {
  try {
    const { companyName, email, password, phone } = req.body;
    
    const db = mongoose.connection.db;
    const companiesCollection = db.collection('companies');

    const existingCompany = await companiesCollection.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ success: false, error: 'Company already exists' });
    }

    const newCompanyData = { 
      companyName, 
      email, 
      password, 
      phone, 
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await companiesCollection.insertOne(newCompanyData);
    res.status(201).json({ 
      success: true, 
      message: 'Company registered successfully', 
      data: { _id: result.insertedId, ...newCompanyData } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API Routes
app.use('/api/properties', require('./routes/properties'));

// Serve static frontend files from the sibling frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Fallback to index.html for frontend routing if needed
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
server.setTimeout(300000); // 300,000ms = 5 minutes