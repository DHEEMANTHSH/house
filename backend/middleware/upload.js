const multer = require('multer');

// Store files in memory buffer to save directly to MongoDB as Base64 text
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ensure this export is present and correct
module.exports = upload;