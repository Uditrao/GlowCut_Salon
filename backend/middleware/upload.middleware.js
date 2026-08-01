const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const galleryDir = path.join(__dirname, '../uploads/gallery');
const aiDir = path.join(__dirname, '../uploads/ai-photos');

if (!fs.existsSync(galleryDir)) {
  fs.mkdirSync(galleryDir, { recursive: true });
}
if (!fs.existsSync(aiDir)) {
  fs.mkdirSync(aiDir, { recursive: true });
}

// Storage for AI Photos
const aiStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, aiDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `ai-${uniqueSuffix}${ext}`);
  }
});

// Storage for Gallery Uploads
const galleryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, galleryDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `gallery-${uniqueSuffix}${ext}`);
  }
});

// File filter (Only images)
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPG, PNG, WEBP) are allowed!'));
  }
};

const uploadAIPhoto = multer({
  storage: aiStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: imageFilter
});

const uploadGalleryImage = multer({
  storage: galleryStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: imageFilter
});

module.exports = {
  uploadAIPhoto,
  uploadGalleryImage
};
