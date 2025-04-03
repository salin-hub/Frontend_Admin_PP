import { useState } from 'react';
import { TextField, Button, Typography, Grid, Paper, Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

const Settings = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Add your API request here to update the account info

    setSuccess('Account information updated successfully');
    setError('');
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Paper sx={{ padding: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Account Settings
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Update your profile details and change your password.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
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
            <Button variant="outlined" color="secondary" sx={{ marginRight: 2 }} onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save Changes
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Settings;
