import React, { useState } from 'react';
import axios from 'axios';
import './uploadForm.css';

const UploadForm = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.');
    }

    if (file.size > maxSize) {
      throw new Error('File is too large. Maximum size is 5MB.');
    }
  };

  const processFile = (file) => {
    setError(null);
    setSuccess(false);
    
    if (!file) return;

    try {
      validateFile(file);
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError(err.message);
      setImage(null);
      setPreview(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError('Please select an image to upload');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', image);

    try {
      await axios.post('/api/upload', formData);
      setSuccess(true);
      
      // Reset form after a short delay
      setTimeout(() => {
        setImage(null);
        setPreview(null);
        setSuccess(false);
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
      }, 2000);

      // Trigger a custom event to notify the gallery to refresh
      window.dispatchEvent(new CustomEvent('imageUploaded'));
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-form">
      <h2>Upload New Image</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div 
            className={`file-input-container ${dragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/gif,image/webp"
              disabled={loading}
            />
            <div className="file-input-label">
              <div className="upload-icon">
                {loading ? '⏳' : '📁'}
              </div>
              <div className="file-input-text">
                {dragOver ? 'Drop your image here' : 'Choose an image or drag & drop'}
              </div>
              <div className="file-input-subtext">
                PNG, JPG, GIF, WebP up to 5MB
              </div>
            </div>
          </div>
          
          {preview && (
            <div className="preview">
              <span className="preview-label">Preview:</span>
              <img src={preview} alt="Preview" />
            </div>
          )}
        </div>
        
        {error && <div className="error">{error}</div>}
        {success && <div className="success">Image uploaded successfully! 🎉</div>}
        
        <button 
          type="submit" 
          disabled={!image || loading}
          className={`upload-button ${loading ? 'loading' : ''}`}
        >
          {loading ? 'Uploading...' : success ? 'Uploaded!' : 'Upload Image'}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
