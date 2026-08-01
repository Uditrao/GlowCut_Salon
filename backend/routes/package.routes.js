const express = require('express');
const router = express.Router();
const { getPackages, getPackageById, createPackage } = require('../controllers/package.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/', getPackages);
router.get('/:id', getPackageById);
router.post('/', protect, adminOnly, createPackage);

module.exports = router;
