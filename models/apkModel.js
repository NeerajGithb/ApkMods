const mongoose = require('mongoose');

const apkSchema = new mongoose.Schema({
  loaderType: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type:String,
    required: false,
  },
  key: String,
  fileUrl: String,
  expiresAt: Date,
  telegramLink: {
    type: String,
    required: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('Apk', apkSchema);
