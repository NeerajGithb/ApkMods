const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadApk, getLatestApk, getApkByLoader } = require('../controllers/apkController');

// ✅ Use memory storage for direct Cloudinary upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('apkFile'), uploadApk);
router.get('/latest', getLatestApk);
router.get('/:loaderType', getApkByLoader);

module.exports = router;
