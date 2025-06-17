const { cloudinary } = require('../config/cloudinary');
const Apk = require('../models/apkModel');
const streamifier = require('streamifier');

// 📦 Upload buffer to Cloudinary
const streamUpload = (buffer, loaderType) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'apk_uploads',
        public_id: loaderType,
        overwrite: true,
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ✅ Upload or update APK
exports.uploadApk = async (req, res) => {
  try {
    const { name, key, expiresAt, loaderType, telegramLink } = req.body;

    if (!loaderType) {
      return res.status(400).json({ error: 'loaderType must be provided' });
    }

    let apk = await Apk.findOne({ loaderType });

    // 🛠 Update existing APK
    if (apk) {
      if (req.file) {
        const result = await streamUpload(req.file.buffer, loaderType);
        apk.fileUrl = result.secure_url;
      }

      apk.name = name || apk.name;
      apk.key = key || apk.key;
      apk.expiresAt = expiresAt || apk.expiresAt;
      apk.telegramLink = telegramLink || apk.telegramLink;

      await apk.save();
      return res.json({ message: 'APK updated successfully', apk });
    }

    // ➕ New APK
    if (!name || !key || !expiresAt || !req.file) {
      return res.status(400).json({
        error: 'Name, key, expiresAt, and APK file are required for new APK upload',
      });
    }

    const result = await streamUpload(req.file.buffer, loaderType);

    const newApk = new Apk({
      loaderType,
      name,
      key,
      expiresAt,
      telegramLink: telegramLink || '',
      fileUrl: result.secure_url,
    });

    await newApk.save();
    return res.status(201).json({ message: 'APK uploaded successfully', apk: newApk });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed: ' + err.message });
  }
};

// ✅ Get all latest APKs (sorted by newest)
exports.getLatestApk = async (req, res) => {
  try {
    const apk = await Apk.find().sort({ createdAt: -1 });
    if (!apk || apk.length === 0) {
      return res.status(404).json({ message: 'No APK found' });
    }
    res.status(200).json(apk);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get APK by loaderType
exports.getApkByLoader = async (req, res) => {
  try {
    const { loaderType } = req.params;
    const apk = await Apk.findOne({ loaderType });
    if (!apk) {
      return res.status(404).json({ message: 'No APK found for this loaderType' });
    }
    res.status(200).json(apk);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
