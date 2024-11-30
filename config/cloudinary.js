const cloudinary = require('cloudinary').v2;

/*cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});*/
cloudinary.config({
  cloud_name:'dgwqgrbof',
  api_key:'457492125556172',
  api_secret:'eBEzvKQWTSuFFxrhnb4N6ChzDG8',
});
module.exports = cloudinary;
