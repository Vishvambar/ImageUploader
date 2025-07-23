import React from 'react';
import UploadForm from './uploadForm';
import ImageGallery from './ImageGallery';
import './ImageGallery.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Image Uploader</h1>
      </header>
      <main>
        <UploadForm />
        <ImageGallery />
      </main>
    </div>
  );
}

export default App;
