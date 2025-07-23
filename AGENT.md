# ImageUploader - Agent Documentation

## Project Overview

This is a full-stack MERN (MongoDB-less) application for image uploading and gallery viewing. The project uses React for the frontend, Node.js/Express for the backend, and Cloudinary for image storage and management.

## Project Structure

```
ImageUploader/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── App.js         # Main application component
│   │   ├── uploadForm.js  # Image upload form component
│   │   ├── ImageGallery.js # Gallery display component
│   │   ├── ImageGallery.css # Styling for gallery
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   ├── public/            # Static assets
│   ├── package.json       # Client dependencies and scripts
│   └── README.md         # Create React App documentation
└── server/                # Express backend API
    ├── routes/
    │   └── upload.route.js # Image upload and fetch routes
    ├── middlewares/
    │   └── multer.middleware.js # File upload middleware
    ├── index.js           # Express server entry point
    ├── package.json       # Server dependencies and scripts
    └── .env               # Environment variables (secrets)
```

## Technologies Used

### Frontend (React)
- **React 19.1.0** - Main frontend framework
- **axios 1.9.0** - HTTP client for API requests
- **React Testing Library** - Testing utilities (@testing-library/react, @testing-library/jest-dom, @testing-library/dom, @testing-library/user-event)
- **Create React App** - React build tooling and development server

### Backend (Node.js/Express)
- **Express 5.1.0** - Web framework
- **Cloudinary 2.6.1** - Image storage and management service
- **Multer 2.0.1** - File upload middleware
- **CORS 2.8.5** - Cross-origin resource sharing
- **dotenv 16.5.0** - Environment variable management
- **nodemon 3.1.10** - Development server with auto-restart

## Development Commands

### Client (React)
Navigate to `client/` directory:
```bash
cd client
npm start          # Start development server (http://localhost:3000)
npm run build      # Create production build
npm run dev        # Start with Netlify Functions (for deployment testing)
npm run deploy     # Deploy to Netlify production
npm test           # Run tests in interactive watch mode
npm run eject      # Eject from Create React App (irreversible)
```

### Legacy Server (Express) - Not used in deployment
Navigate to `server/` directory:
```bash
cd server
npm run dev        # Start development server with nodemon (http://localhost:5000)
npm start          # Start production server (node index.js)
npm test           # Run tests (currently not implemented)
```

### Development Setup

#### For Local Development with Netlify Functions:
1. Navigate to client: `cd client`
2. Install dependencies: `npm install`
3. Copy environment file: `cp .env.example .env`
4. Add your Cloudinary credentials to `.env`
5. Start Netlify dev server: `npm run dev`
6. Access the application at http://localhost:8888

#### For Traditional Development (Legacy):
1. Start the server: `cd server && npm run dev`
2. Start the client: `cd client && npm start`
3. Access the application at http://localhost:3000
4. API endpoints available at http://localhost:5000

## Environment Configuration

### Required Environment Variables (.env in server/)
```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

## API Endpoints

### Upload Routes (`/api/upload`)
- **GET** `/api/upload` - Fetch all uploaded images from Cloudinary
- **POST** `/api/upload` - Upload a new image to Cloudinary

## Key Features

### Image Upload
- File validation (JPEG, PNG, GIF, WebP only)
- Size limit: 5MB maximum
- Client-side preview before upload
- Error handling for invalid files
- Real-time upload progress

### Image Gallery
- Displays images in grid layout
- Images fetched from Cloudinary
- Sorted by upload date (newest first)
- Right-click disabled on images
- Responsive design

### File Handling
- Memory storage using Multer
- Base64 encoding for Cloudinary upload
- Automatic folder organization ('ImageUploader' folder)
- Secure URL generation

## Code Conventions

### Frontend
- **Components**: PascalCase (e.g., `UploadForm`, `ImageGallery`)
- **Files**: camelCase for components (e.g., `uploadForm.js`)
- **CSS**: kebab-case classes (e.g., `.image-gallery`, `.upload-form`)
- **State Management**: React hooks (useState, useEffect)
- **HTTP Requests**: Axios with async/await

### Backend
- **Files**: camelCase with descriptive suffixes (e.g., `upload.route.js`, `multer.middleware.js`)
- **Routes**: Express Router with ES6 imports
- **Error Handling**: Try-catch blocks with descriptive error messages
- **Middleware**: Functional middleware with proper error propagation

## Security Considerations

- File type validation on both client and server
- File size limits enforced
- CORS configuration for specific origins
- Environment variables for sensitive data
- Error details only shown in development mode
- Right-click disabled on gallery images

## Testing

### Client Testing
- Uses React Testing Library and Jest
- Test files should follow `*.test.js` naming convention
- Run tests with `npm test` in client directory

### Server Testing
- Currently no tests implemented
- Should implement unit tests for routes and middleware
- Consider using Jest or Mocha for server-side testing

## Build and Deployment

### Client Build
```bash
cd client
npm run build
```
Creates optimized production build in `client/build/`

### Server Build
No build step required - Node.js runs directly
Ensure all environment variables are set in production

## Common Issues and Troubleshooting

1. **CORS Issues**: Check `CLIENT_URL` environment variable
2. **Upload Failures**: Verify Cloudinary credentials
3. **File Size Errors**: Check both client and server size limits
4. **Port Conflicts**: Modify PORT in .env or package.json scripts

## Development Workflow

1. Always start server before client
2. Check environment variables are set
3. Use browser dev tools for debugging client issues
4. Check server console for API errors
5. Test file uploads with various image formats and sizes

## Deployment

This project is configured for deployment on **Netlify** using Netlify Functions. See [`DEPLOYMENT.md`](file:///c:/Users/Admin/Desktop/MERN%20PROJECTS/ImageUploader/DEPLOYMENT.md) for complete deployment instructions.

### Quick Deployment Steps:
1. Push code to GitHub/GitLab/Bitbucket
2. Connect repository to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy automatically

### Environment Variables for Production:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Future Enhancements

- Image deletion functionality
- User authentication
- Image categorization/tagging
- Drag-and-drop upload interface
- Progress bars for uploads
- Image editing capabilities
- Bulk upload support
