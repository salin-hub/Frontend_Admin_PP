import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Grid, Paper, Box, IconButton, Avatar, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import axios from '../../API/axios';

const AdminProfileManagement = () => {
  const navigate = useNavigate();

  // State to hold the list of users and selected user data
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch list of users (for admin to select from)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/accounts', {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        setUsers(response.data.users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Fetch selected user data for editing
  useEffect(() => {
    if (selectedUser) {
      const fetchUserDetails = async () => {
        try {
          // API call to get user details (replace with actual API)
          const response = await axios.get(`/accounts`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
          });

          setFormData({
            name: response.data.name,
            email: response.data.email,
            password: '',
            confirmPassword: '',
          });
          setProfilePic(response.data.profilePic || null);
        } catch (error) {
          console.error('Failed to fetch user details:', error);
        }
      };

      fetchUserDetails();
    }
  }, [selectedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file)); // Show selected profile picture immediately
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Form data to submit (admin editing user profile)
      const updatedData = new FormData();
      updatedData.append('name', formData.name);
      updatedData.append('email', formData.email);
      updatedData.append('password', formData.password);

      if (profilePic) {
        updatedData.append('profilePic', profilePic); // Append new profile picture if available
      }

      await axios.post(`/admin/user/${selectedUser}/update`, updatedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });

      setSuccess('User profile updated successfully');
      setError('');
    } catch (error) {
      setError('Failed to update profile. Please try again.');
      setSuccess('');
    }

    setLoading(false);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Paper sx={{ padding: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Admin - Manage User Profiles
        </Typography>
        
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Select User</InputLabel>
          <Select
            value={selectedUser || ''}
            onChange={(e) => setSelectedUser(e.target.value)}
            label="Select User"
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedUser && (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Profile Picture */}
              <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Avatar
                  sx={{ width: 120, height: 120 }}
                  src={profilePic || '/default-profile.png'} // Default profile picture if none is set
                />
                <label htmlFor="profile-pic-upload">
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                    }}
                    aria-label="upload profile picture"
                    component="span"
                  >
                    <CameraAltIcon />
                  </IconButton>
                </label>
                <input
                  type="file"
                  id="profile-pic-upload"
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Grid>

              {/* Name Field */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <IconButton sx={{ padding: 0 }}>
                        <AccountCircleIcon />
                      </IconButton>
                    ),
                  }}
                />
              </Grid>

              {/* Email Field */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  required
                  InputProps={{
                    startAdornment: (
                      <IconButton sx={{ padding: 0 }}>
                        <EmailIcon />
                      </IconButton>
                    ),
                  }}
                />
              </Grid>

              {/* Password Field */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Password"
                  variant="outlined"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type="password"
                  required
                  InputProps={{
                    startAdornment: (
                      <IconButton sx={{ padding: 0 }}>
                        <LockIcon />
                      </IconButton>
                    ),
                  }}
                />
              </Grid>

              {/* Confirm Password Field */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  variant="outlined"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  type="password"
                  required
                  InputProps={{
                    startAdornment: (
                      <IconButton sx={{ padding: 0 }}>
                        <LockOpenIcon />
                      </IconButton>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {/* Error and Success Messages */}
            {error && (
              <Typography color="error" sx={{ marginTop: 2 }}>
                {error}
              </Typography>
            )}

            {success && (
              <Typography color="success" sx={{ marginTop: 2 }}>
                {success}
              </Typography>
            )}

            {/* Buttons */}
            <Box sx={{ marginTop: 3 }}>
              <Button variant="outlined" color="secondary" sx={{ marginRight: 2 }} onClick={() => navigate('/admin/dashboard')}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ position: 'relative' }}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default AdminProfileManagement;
