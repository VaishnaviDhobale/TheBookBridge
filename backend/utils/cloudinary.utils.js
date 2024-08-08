const cloudinary = require("cloudinary").v2;
const fs = require("fs");


// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

 const uploadOnClaoudinary = async (localFilePath) => {
    try{
        if(!localFilePath){
            return null;
        }

       const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type : "auto"
        });

        return response;


    }catch(error){
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file as upload option gets fail.
        return null;
    }
};

module.exports = {uploadOnClaoudinary}