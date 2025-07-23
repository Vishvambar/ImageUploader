# Netlify Deployment Guide

## Overview

This ImageUploader project has been configured for deployment on Netlify. The Express backend has been converted to Netlify Functions, and all configurations are in place for seamless deployment.

## Project Changes Made

### 1. Backend Conversion
- Converted Express server to Netlify Functions
- Created `/client/netlify/functions/upload.js` with GET and POST handlers
- Implemented multipart form data parsing for file uploads

### 2. Frontend Updates
- Updated API endpoints from `http://localhost:5000/api/upload` to `/api/upload`
- Configured redirects to route API calls to Netlify Functions

### 3. Configuration Files
- **`netlify.toml`**: Main Netlify configuration
- **`client/public/_redirects`**: URL redirects for API routing
- **`client/.env.example`**: Environment variable template

### 4. Dependencies
- Added `cloudinary` and `multer` to client dependencies
- Added `netlify-cli` as dev dependency for local testing

## Deployment Steps

### Step 1: Prepare Your Repository
1. Ensure all changes are committed to your Git repository
2. Push to GitHub, GitLab, or Bitbucket

### Step 2: Connect to Netlify
1. Go to [netlify.com](https://netlify.com) and sign up/log in
2. Click "New site from Git"
3. Choose your repository
4. Netlify will auto-detect the configuration from `netlify.toml`

### Step 3: Configure Environment Variables
In your Netlify dashboard, go to Site settings > Environment variables and add:

```
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Step 4: Deploy
1. Click "Deploy site"
2. Netlify will build and deploy your application
3. Your site will be available at a generated URL (e.g., `https://amazing-app-123456.netlify.app`)

## Local Development with Netlify

### Install Netlify CLI
```bash
cd client
npm install
```

### Set up local environment
1. Copy `.env.example` to `.env` in the client directory
2. Add your Cloudinary credentials to the `.env` file

### Run locally
```bash
cd client
npm run dev
```

This will start the Netlify development server with Functions support.

## Build Configuration

The project is configured with:
- **Build directory**: `client`
- **Publish directory**: `client/build`
- **Functions directory**: `client/netlify/functions`
- **Build command**: `npm run build`

## Environment Variables Needed

| Variable | Description | Example |
|----------|-------------|---------|
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | `my-cloud` |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret | `abcdef123456...` |

## API Endpoints

After deployment, your API will be available at:
- **GET** `https://your-site.netlify.app/api/upload` - Fetch all images
- **POST** `https://your-site.netlify.app/api/upload` - Upload new image

## Features Preserved

✅ **File Upload**: Complete file upload functionality  
✅ **Image Gallery**: Display of uploaded images  
✅ **File Validation**: Size and type restrictions  
✅ **Error Handling**: Proper error messages  
✅ **CORS**: Cross-origin request handling  
✅ **Security**: File type validation and size limits  

## Troubleshooting

### Common Issues

1. **Environment Variables Not Working**
   - Ensure variables are set in Netlify dashboard
   - Redeploy after adding environment variables

2. **Function Timeouts**
   - Netlify Functions have a 10-second timeout for free plans
   - Large file uploads might need optimization

3. **Build Failures**
   - Check build logs in Netlify dashboard
   - Ensure all dependencies are in `client/package.json`

4. **CORS Issues**
   - The Netlify Function includes CORS headers
   - Check browser console for specific CORS errors

### Debug Commands

```bash
# Test local build
cd client
npm run build

# Test with Netlify CLI
npx netlify dev

# Deploy preview
npx netlify deploy

# Deploy to production
npx netlify deploy --prod
```

## Performance Considerations

- Images are stored on Cloudinary (external CDN)
- Netlify Functions have cold start latency
- Free tier has 125k function invocations/month
- Consider upgrading for high-traffic applications

## Security Notes

- Environment variables are secure in Netlify
- File upload validation is in place
- CORS is properly configured
- No sensitive data is exposed in the frontend

## Next Steps

After successful deployment:

1. **Custom Domain**: Add your custom domain in Netlify settings
2. **SSL Certificate**: Netlify provides free SSL automatically
3. **Analytics**: Enable Netlify Analytics for insights
4. **Form Handling**: Consider Netlify Forms for contact forms
5. **Performance**: Monitor Core Web Vitals and optimize

## Support

For issues specific to:
- **Netlify**: Check [Netlify documentation](https://docs.netlify.com/)
- **Cloudinary**: Check [Cloudinary documentation](https://cloudinary.com/documentation)
- **React**: Check [React documentation](https://reactjs.org/docs)

Your ImageUploader is now ready for production deployment on Netlify! 🚀
