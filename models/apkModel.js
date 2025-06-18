const mongoose = require('mongoose');

const apkSchema = new mongoose.Schema({
  loaderType: {
    type: String,
    required: true,
    unique: true // This ensures each loaderType can have only one APK entry
  },
  name: {
    type: String,
    required: false, // optional for partial updates
    default: ""
  },
  key: {
    type: String,
    required: false,
    default: ""
  },
  fileUrl: {
    type: String,
    required: false,
    default: ""
  },
  expiresAt: {
    type: Date,
    required: false
  },
  telegramLink: {
    type: String,
    required: false,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model('Apk', apkSchema);
