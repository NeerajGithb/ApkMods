const mongoose = require('mongoose');

const apkSchema = new mongoose.Schema({
  loaderType: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  key: String,
  fileUrl: String,
  expiresAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Apk', apkSchema);
