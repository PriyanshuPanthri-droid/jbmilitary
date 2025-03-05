// cloud storage use krna pdega for production - -------------->


import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure the uploads directory exists
const uploadDirectory = 'uploads/';
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, WEBP, and PDF files are allowed.'), false);
  }
};

// Create multer upload instance
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
    files: 10 // Maximum 10 files
  }
});

// Error handling middleware for file uploads
export const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle Multer-specific errors
    return res.status(400).json({
      success: false,
      message: err.message
    });
  } else if (err) {
    // Handle other errors
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};
