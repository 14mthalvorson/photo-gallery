import React, { useState, useEffect } from "react";
import { Grid, Container, Box } from "@mui/material";
import axios from "axios";

const App = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("http://18.233.100.117:3001/images");
      setImages(result.data);
    };
    fetchData();
  }, []);

  const handleDownload = async (key) => {
    const response = await axios.get(
      `http://18.233.100.117:3001/download?key=${key}`,
      { responseType: "blob" }
    );    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", key);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Grid container spacing={4}>
          {images.map((image) => (
            <Grid item xs={12} sm={6} md={4} key={image.key}>
              <Box>
                <img
                  src={image.url}
                  alt={image.key}
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                />
                <button onClick={() => handleDownload(image.key)}>
                  Download
                </button>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default App;
