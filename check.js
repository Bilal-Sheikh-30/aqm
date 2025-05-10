// cloudinary setup
const cloudinary = require('cloudinary').v2;
const fs = require('fs');//added
const path = require('path');
// Set up Cloudinary configuration
cloudinary.config({
    cloud_name: 'dyyloikhk', // Replace with your Cloudinary cloud name
    api_key: '626198757521673',       // Replace with your Cloudinary API key
    api_secret: 'aJJ3QJ9BgWNxcxPldc2b75MENtA'  // Replace with your Cloudinary API secret
  });
  
  // Path to the firmware file
  const firmwarePath = path.join(__dirname, 'firmware.txt');
  
  // Upload the firmware to Cloudinary
  cloudinary.uploader.upload(firmwarePath, {
     resource_type: 'raw',
     public_id: 'check/firmware',
     overwrite: true },

     function(error, result) {
    if (error) {
      console.log('Upload Error:', error);
    } else {
      console.log('Upload Success:', result);
      console.log('Firmware URL:', result.secure_url); // The URL of the uploaded file

    }
  });