const multer = require('multer');
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const cloudinary = require('../Config/cloudinary') ;

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder: "bokusupermarket",
        allowedFormats: ['jpg', 'jpeg', 'png'],
        transformation: [{ width: 500, height: 500, crop: "limit"}]
    }
});