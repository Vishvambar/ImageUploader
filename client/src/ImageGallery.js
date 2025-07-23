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
    const disableContextMenu = (e) => e.preventDefault();


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
    return <div>Loading images...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="image-gallery">
      <h2>Uploaded Images</h2>
      {images.length === 0 ? (
        <p>No images uploaded yet.</p>
      ) : (
        <div className="gallery-grid">
          {images.map((image) => (
            <div key={image.public_id} className="gallery-item">
              <img src={image.url} alt="Uploaded content" onContextMenu={(e) => e.preventDefault()} />
              <div className="image-info">
                <span>{new Date(image.created_at).toLocaleDateString()}</span>
                <a href={image.url} target="_blank" rel="noopener noreferrer">
                  View Full Size
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery; 