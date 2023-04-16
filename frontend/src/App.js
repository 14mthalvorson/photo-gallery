import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://18.233.100.117:3000';

function App() {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    try {
      const response = await axios.get(`${API_URL}/images`);
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  }

  async function uploadImage() {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setImages([...images, { key: response.data.key, url: response.data.imageUrl }]);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

  async function deleteImage(key) {
    try {
      await axios.delete(`${API_URL}/delete/${key}`);
      setImages(images.filter((image) => image.key !== key));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }

  function handleFileChange(event) {
    setSelectedFile(event.target.files[0]);
  }

  return (
    <div className="App">
      <h1>Photo Gallery</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadImage}>Upload</button>
      <div className="image-grid">
        {images.map((image) => (
          <div key={image.key} className="image-container">
            <img src={image.url} alt="" />
            <button onClick={() => deleteImage(image.key)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
