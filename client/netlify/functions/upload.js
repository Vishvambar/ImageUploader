import { v2 as cloudinary } from 'cloudinary';

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to parse multipart form data
const parseMultipartForm = (event) => {
  return new Promise((resolve, reject) => {
    try {
      const contentType = event.headers['content-type'] || event.headers['Content-Type'];
      if (!contentType || !contentType.includes('multipart/form-data')) {
        reject(new Error('Invalid content type'));
        return;
      }

      const boundary = contentType.split('boundary=')[1];
      if (!boundary) {
        reject(new Error('No boundary found'));
        return;
      }

      const body = event.isBase64Encoded 
        ? Buffer.from(event.body, 'base64')
        : Buffer.from(event.body, 'utf8');
      
      const parts = body.toString('binary').split(`--${boundary}`);
      
      for (const part of parts) {
        if (part.includes('Content-Disposition: form-data') && part.includes('filename')) {
          const lines = part.split('\r\n');
          let contentType = 'application/octet-stream';
          let filename = '';
          
          // Parse headers
          for (const line of lines) {
            if (line.includes('filename=')) {
              const match = line.match(/filename="([^"]+)"/);
              if (match) filename = match[1];
            }
            if (line.startsWith('Content-Type:')) {
              contentType = line.split('Content-Type:')[1].trim();
            }
          }
          
          // Find the start of file data (after headers)
          const headerEndIndex = part.indexOf('\r\n\r\n');
          if (headerEndIndex === -1) continue;
          
          const fileDataStart = headerEndIndex + 4;
          const fileDataEnd = part.lastIndexOf('\r\n');
          const fileData = part.slice(fileDataStart, fileDataEnd);
          
          if (fileData) {
            const buffer = Buffer.from(fileData, 'binary');
            resolve({
              buffer: buffer,
              originalname: filename,
              mimetype: contentType,
              size: buffer.length
            });
            return;
          }
        }
      }
      
      reject(new Error('No file found in request'));
    } catch (error) {
      reject(error);
    }
  });
};

export const handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    if (event.httpMethod === 'GET') {
      // Get all images
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

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(images),
      };
    } 
    
    else if (event.httpMethod === 'POST') {
      // Upload image
      try {
        const file = await parseMultipartForm(event);
        
        // Validate file
        if (!file || !file.buffer) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'No image file provided' }),
          };
        }

        // Check file size
        if (file.size > 5 * 1024 * 1024) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'File size too large. Maximum size is 5MB' }),
          };
        }

        // Check file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
        if (!validTypes.includes(file.mimetype)) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.' }),
          };
        }

        const fileStr = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

        const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
          folder: 'ImageUploader',
          resource_type: 'auto',
          allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
        });

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            url: uploadedResponse.secure_url,
            public_id: uploadedResponse.public_id,
            format: uploadedResponse.format,
          }),
        };
      } catch (uploadError) {
        console.error('Upload error:', uploadError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            error: uploadError.message || 'Upload failed',
          }),
        };
      }
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message || 'Internal server error',
      }),
    };
  }
};
