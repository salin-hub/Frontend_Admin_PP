import { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';
import { CircularProgress, Backdrop } from '@mui/material';
import axios from '../../API/axios';
import {

  Box,

} from "@mui/material";
const CreateAuthorForm = () => {
  const [loading, setLoading] = useState(false);
  const [authorData, setAuthorData] = useState({
    name: '',
    email: '',
    description: '',
    image: null,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthorData({ ...authorData, [name]: value });
  };
  const handleReset = () => {
    setAuthorData({
      name: '',
      email: '',
      description: '',
      image: null,
    });
  };
  const handleFileChange = (e) => {
    setAuthorData({ ...authorData, image: e.target.files[0] });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', authorData.name);
    formData.append('email', authorData.email);
    formData.append('description', authorData.description);
    if (authorData.image) {
      formData.append('image', authorData.image);
    }

    try {
      const response = await axios.post('authors', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you use token-based auth
        },
      });
      alert(response.data.message);
      setAuthorData({
        name: '',
        email: '',
        description: '',
        image: null,
      });
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message);
      } else {
        alert('An error occurred while creating the author.');
      }
    } finally{
      setLoading(false)
    }
  };

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="nameCreate">
        <h1>Create Authors</h1>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>

        <Box sx={{ width: "90%", padding: 2, border: "1px solid #ddd", borderRadius: "8px" }}>
          <form onSubmit={handleSubmit} style={{ padding: '10px', maxWidth: '90%', margin: 'auto' }}>
            <Grid container style={{ display: "flex", "justifyContent": "center", gap: "20px" }}>
              <div style={{ width: "50%", display: "flex", flexDirection: "column" }}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Author Name"
                  variant="outlined"
                  placeholder="Enter Author Name"
                  name="name"
                  value={authorData.name}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Author Email"
                  variant="outlined"
                  placeholder="Enter Author Email"
                  type="email"
                  name="email"
                  value={authorData.email}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Author Description"
                  variant="outlined"
                  placeholder="Enter Author Description"
                  multiline
                  rows={4}
                  name="description"
                  value={authorData.description}
                  onChange={handleChange}
                />
              </div>
              <div style={{ width: "45%", display: "flex", flexDirection: "column" }}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Image URL or File"
                  variant="outlined"
                  placeholder="Enter Image URL or File"
                  value={authorData.image ? authorData.image.name : ''}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                {authorData.image && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <img
                      src={URL.createObjectURL(authorData.image)}
                      alt="Author Preview"
                      style={{
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1px solid #ccc',
                        padding: '4px'
                      }}
                    />
                  </Box>
                )}
                <Button fullWidth variant="contained" component="label" color="error" sx={{ marginBottom: 2 }}>
                  + Select File
                  <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </Button>


              </div>

            </Grid>
            <div style={{ display: 'flex', gap: '10px', justifyContent: "flex-end" }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => handleReset()}
                sx={{
                  width: '100px',
                  padding: '10px',
                  fontSize: '16px',
                  background: 'red',
                }}
              >
                Reset
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={{
                  width: '100px',
                  padding: '10px',
                  fontSize: '16px',
                  background: '#7e3ff2',
                }}
              >
                Submit
              </Button>
            </div>
          </form >
        </Box>
      </div>
    </>
  );
};

export default CreateAuthorForm;
