import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/upload');
      setImages(response.data);
    } catch (err) {
      setError('Failed to fetch images. Please try again later.');
      console.error('Error fetching images:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();

    // Listen for new image uploads
    const handleImageUploaded = () => {
      fetchImages();
    };

    window.addEventListener('imageUploaded', handleImageUploaded);

    // Cleanup listener
    return () => {
      window.removeEventListener('imageUploaded', handleImageUploaded);
    };
  }, []);

  if (loading && images.length === 0) {
    return (
      <div className="image-gallery">
        <h2>Gallery</h2>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading your beautiful images...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="image-gallery">
        <h2>Gallery</h2>
        <div className="error">
          {error}
          <button onClick={fetchImages} className="action-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="image-gallery">
      <h2>Gallery</h2>
      {images.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📷</div>
          <div className="empty-title">No images yet</div>
          <div className="empty-description">
            Upload your first image to start building your gallery!
          </div>
        </div>
      ) : (
        <div className="gallery-grid">
          {images.map((image, index) => (
            <div key={image.public_id} className="gallery-item" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="image-container">
                <img src={image.url} alt="Uploaded content" onContextMenu={(e) => e.preventDefault()} />
                <div className="image-overlay">
                  <div className="overlay-content">
                    <a href={image.url} target="_blank" rel="noopener noreferrer" className="view-button">
                      View Full Size
                    </a>
                  </div>
                </div>
              </div>
              <div className="image-info">
                <div className="image-date">
                  {new Date(image.created_at).toLocaleDateString()}
                </div>
                <div className="image-actions">
                  <button 
                    className="action-button download-button"
                    onClick={() => window.open(image.url, '_blank')}
                    title="Download"
                  ></button>
                  <button 
                    className="action-button share-button"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'Check out this image!',
                          url: image.url
                        });
                      } else {
                        navigator.clipboard.writeText(image.url);
                        alert('Image URL copied to clipboard!');
                      }
                    }}
                    title="Share"
                  ></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery; 