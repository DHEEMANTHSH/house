const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studenthub')
  .then(async () => {
    console.log('Connected to MongoDB...');
    
    const db = mongoose.connection.db;
    const companiesCollection = db.collection('companies');

    // Delete any existing admin record first so it starts completely fresh
    await companiesCollection.deleteOne({ email: 'admin@homerent.com' });

    // Insert the admin account fresh
    await companiesCollection.insertOne({
      companyName: 'admin',
      email: 'admin@homerent.com',
      password: 'house123',
      phone: '9999999999',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Admin account successfully deleted and recreated in companies collection!');
    process.exit();
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });