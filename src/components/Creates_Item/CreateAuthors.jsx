import { useState } from 'react';
import { TextField, Button } from '@mui/material';
import axios from '../../API/axios';

const CreateAuthorForm = () => {
  const [authorData, setAuthorData] = useState({
    name: '',
    email: '',
    description: '',
    image: null,
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthorData({ ...authorData, [name]: value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setAuthorData({ ...authorData, image: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

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
      alert(response.data.message); // Display success message
      // Clear form after successful submission
      setAuthorData({
        name: '',
        email: '',
        description: '',
        image: null,
      });
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message); // Display error message
      } else {
        alert('An error occurred while creating the author.');
      }
    }
  };

  return (
    <>
      <div className="nameCreate">
        <h1>Create Authors</h1>
      </div>
      <form onSubmit={handleSubmit} style={{ padding: '10px', maxWidth: '90%', margin: 'auto' }}>
        {/* Author Name */}
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

        {/* Author Email */}
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

        {/* Author Description */}
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

        {/* Image URL or File */}
        <TextField
          fullWidth
          margin="normal"
          label="Image URL or File"
          variant="outlined"
          placeholder="Enter Image URL or File"
          value={authorData.image ? authorData.image.name : ''}
          InputProps={{
            readOnly: true, // Make it read-only if using file input
          }}
        />

        {/* File Upload Button */}
        <Button fullWidth variant="contained" component="label" color="error" sx={{ marginBottom: 2 }}>
          + Select File
          <input type="file" hidden onChange={handleFileChange} />
        </Button>

        {/* Submit Button */}
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          sx={{
            padding: '10px',
            fontSize: '16px',
            background: '#7e3ff2',
          }}
        >
          Submit
        </Button>
      </form>
    </>
  );
};

export default CreateAuthorForm;
