const express = require('express');
const router = express.Router();
const { getGallery, uploadCustomerPhoto } = require('../controllers/gallery.controller');
const { uploadGalleryImage } = require('../middleware/upload.middleware');

router.get('/', getGallery);
router.post('/', uploadGalleryImage.single('image'), uploadCustomerPhoto);

module.exports = router;
