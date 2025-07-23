import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setError(null);
    
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
      e.target.value = null; // Reset input
    }
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
      alert('Upload successful!');
      
      // Reset form
      setImage(null);
      setPreview(null);
      e.target.reset();

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
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/gif,image/webp"
            disabled={loading}
          />
          {preview && (
            <div className="preview">
              <img src={preview} alt="Preview" style={{ maxWidth: '200px' }} />
            </div>
          )}
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={!image || loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
