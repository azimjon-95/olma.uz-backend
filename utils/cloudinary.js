require("dotenv/config")
const cloudinary = require("cloudinary");
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_KEY_SECRET,
});

exports.uploads = (file, folder) => {
  return new Promise (resolve => {
    cloudinary.uploader.upload(file,(result) => {
      resolve(result.url)
    }, {
      resource_type: "auto",
      folder: folder,
      // quality: "70:qmax_70"
    })
  })
}