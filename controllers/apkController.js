const { cloudinary } = require('../config/cloudinary');
const Apk = require('../models/apkModel');
const streamifier = require('streamifier'); // ✅ Needed for memory buffer stream

// ✅ Upload APK directly to Cloudinary from memory
exports.uploadApk = async (req, res) => {
  try {
    const { name, key, expiresAt, loaderType,telegramLink } = req.body;

    if (!loaderType || !key || !expiresAt || !req.file) {
      return res.status(400).json({ error: 'All fields including loaderType and file are required' });
    }

    // ✅ Convert memory buffer to stream and upload
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            folder: "apk_uploads",
            public_id: loaderType,  // 👈 Ensures overwrite per loader
            overwrite: true         // 👈 Forces Cloudinary to replace
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    // ✅ Save or update the DB entry
    let apk = await Apk.findOne({ loaderType });

    if (apk) {
      apk.name = name || apk.name;
      apk.key = key || apk.key;
      apk.expiresAt = expiresAt || apk.expiresAt;
      apk.telegramLink = telegramLink || apk.telegramLink;
      apk.fileUrl = result.secure_url;
      await apk.save();
      return res.json({ message: 'APK updated successfully', apk });
    } else {

      if (!name || !telegramLink) {
        return res.status(400).json({
          error: 'Name and Telegram link are required for new uploads',
        });
      }
      const newApk = new Apk({
        loaderType,
        name,
        key,
        expiresAt,
        telegramLink,
        fileUrl: result.secure_url
      });
      await newApk.save();
      return res.status(201).json({ message: 'APK uploaded successfully', apk: newApk });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed: ' + err.message });
  }
};

// ✅ Get latest uploaded APK
exports.getLatestApk = async (req, res) => {
  try {
    const apk = await Apk.find().sort({ createdAt: -1 });
    if (!apk) return res.status(404).json({ message: 'No APK found' });
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
