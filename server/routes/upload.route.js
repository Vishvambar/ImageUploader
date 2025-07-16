import express from 'express';
import upload from '../middlewares/multer.middleware.js';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
const router = express.Router();
dotenv.config();
// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all images
router.get('/', async (req, res) => {
  try {
    const { resources } = await cloudinary.search
      .expression('folder:ImageUploader')
      .sort_by('created_at', 'desc')
      .max_results(30)
      .execute();

    const images = resources.map(file => ({
      public_id: file.public_id,
      url: file.secure_url,
      created_at: file.created_at
    }));

    res.status(200).json(images);
  } catch (err) {
    console.error('Error fetching images:', err);
    res.status(500).json({
      error: 'Error fetching images',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Check file size (additional check)
    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size too large. Maximum size is 5MB' });
    }

    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      folder: 'ImageUploader',
      resource_type: 'auto',
      allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
    });

    res.status(200).json({
      url: uploadedResponse.secure_url,
      public_id: uploadedResponse.public_id,
      format: uploadedResponse.format,
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({
      error: err.message || 'Upload failed',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

export default router;
