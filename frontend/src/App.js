import React, { useState, useEffect } from "react";
import { Grid, Container, Box } from "@mui/material";
import axios from "axios";

const App = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("https://1l0mjwqhxi.execute-api.us-east-1.amazonaws.com/beta/images");
      console.log('API response:', result);
      setImages(result.data);
    };
    fetchData();
  }, []);  

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
