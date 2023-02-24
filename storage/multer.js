const multer = require('multer');
const path = require('path');

// set up Multer storage configuration
const storage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/') ||
      file.mimetype === 'application/pdf') {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('File type not supported'), false); // Reject the file
  }
}


const upload = multer({ storage: storage, fileFilter: multerFilter });

module.exports = upload;
