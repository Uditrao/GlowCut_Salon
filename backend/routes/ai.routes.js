const express = require('express');
const router = express.Router();
const { analyzeHairstyle } = require('../controllers/ai.controller');
const { uploadAIPhoto } = require('../middleware/upload.middleware');

router.post('/hairstyle', uploadAIPhoto.single('photo'), analyzeHairstyle);

module.exports = router;
