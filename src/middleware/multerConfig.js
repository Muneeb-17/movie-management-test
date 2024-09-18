const multer = require('multer');

const multerConfig = multer({
    storage: multer.memoryStorage(), // Store file in memory temporarily
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  });

module.exports = multerConfig;
