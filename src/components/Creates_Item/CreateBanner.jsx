import { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';

import axios from '../../API/axios';

const BannerForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: null,
    books_id: ''
  });

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    axios.get('/getbooks')
      .then(res => setBooks(res.data.books))
      .catch(() => setError('Failed to load books'));
  }, []);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setError('');
    setValidationErrors({});

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('image_url', formData.image_url);
    data.append('books_id', formData.books_id);
    try {
      const response = await axios.post('/banners', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccessMsg('Banner created successfully!');
      setFormData({
        title: '',
        description: '',
        image_url: null,
        books_id: ''
      });

      console.log('Cloudinary Public ID:', response.data.cloudinary_public_id);

    } catch (err) {
      if (err.response?.status === 422) {
        setValidationErrors(err.response.data.errors || {});
      } else {
        setError('Failed to create banner');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 3, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h6" color='black' gutterBottom>Create Banner</Typography>

      {successMsg && <Typography color="success.main">{successMsg}</Typography>}
      {error && <Typography color="error.main">{error}</Typography>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <TextField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          error={!!validationErrors.title}
          helperText={validationErrors.title}
        />

        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          margin="normal"
          error={!!validationErrors.description}
          helperText={validationErrors.description}
        />

        <TextField
          label="Select Book"
          name="books_id"
          value={formData.books_id}
          onChange={handleChange}
          select
          fullWidth
          required
          margin="normal"
          error={!!validationErrors.books_id}
          helperText={validationErrors.books_id}
        >
          {books.map(book => (
            <MenuItem key={book.id} value={book.id}>
              {book.title}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          component="label"
          fullWidth
          sx={{ mt: 2 }}
        >
          Upload Image
          <input
            type="file"
            name="image_url"
            accept="image/*"
            hidden
            onChange={handleChange}
          />
        </Button>

        {formData.image_url && (
          <Typography variant="body2" mt={1}>
            Selected: {formData.image_url.name}
          </Typography>
        )}

        {validationErrors.image_url && (
          <Typography color="error.main" variant="body2" mt={1}>
            {validationErrors.image_url}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Submit'}
        </Button>
      </form>
    </Box>
  );
};

export default BannerForm;
