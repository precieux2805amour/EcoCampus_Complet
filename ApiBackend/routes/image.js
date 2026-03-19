const express = require('express');
const imageController = require('../controllers/image.controller');
const imageUploader = require('../helpers/image-uploader');
const checkAuthMiddleware = require('../middleware/check-auth');
//const { upload } = require('../helpers/image-uploader');
  
const router = express.Router();

router.post('/upload',checkAuthMiddleware,imageUploader.upload.single('image'),imageController.upload);

module.exports = router;