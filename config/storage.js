const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "apk_uploads", // name of the folder in Cloudinary
    resource_type: "raw",  // IMPORTANT: for non-images like APK, ZIP
    format: async (req, file) => "apk", // optional, keeps .apk extension
    public_id: (req, file) => file.originalname.split(".")[0],
  },
});

const upload = multer({ storage });

module.exports = upload;
