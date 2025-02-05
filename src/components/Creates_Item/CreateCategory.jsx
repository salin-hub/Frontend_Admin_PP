import { useState } from 'react';
import { TextField, Button } from '@mui/material';
import axios from '../../API/axios'; // Ensure this is correctly configured

const CreateCategoryForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [loading, setLoading] = useState(false); // Track submission status
  const [error, setError] = useState(null); // Track errors
  const [success, setSuccess] = useState(false); // Track success status

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Axios POST request
      const response = await axios.post('/categories', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      console.log("Category created:", response.data);

      setSuccess(true); // Set success state
      setFormData({ name: '', description: '' }); // Clear form
    } catch (err) {
      // Set error state
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <>
      <div className="nameCreate" >
        <h1>Category List</h1>
      </div>
      <form
        onSubmit={handleSubmit}
        style={{ padding: '10px', maxWidth: '90%', margin: 'auto' }}
      >
        {/* Category Name */}
        <TextField
          fullWidth
          margin="normal"
          label="Category Name"
          variant="outlined"
          placeholder="Enter Category Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        {/* Category Description */}
        <TextField
          fullWidth
          margin="normal"
          label="Category Description"
          variant="outlined"
          placeholder="Enter Category Description"
          multiline
          rows={4}
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        {/* Submit Button */}
        <Button
        
          variant="contained"
          color="primary"
          type="submit"
          sx={{
            paddingLeft: '20px',
            paddingright: '20px',
            fontSize: '16px',
            background: '#7e3ff2',
            marginTop: '20px',
            alignItems:"center"
          }}
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Submitting...' : 'Submit'}
        </Button>

        {/* Display Success Message */}
        {success && (
          <p style={{ color: 'green', textAlign: 'center', marginTop: '20px' }}>
            Category created successfully!
          </p>
        )}

        {/* Display Error Message */}
        {error && (
          <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>
            {error}
          </p>
        )}
      </form></>
  );
};

export default CreateCategoryForm;
