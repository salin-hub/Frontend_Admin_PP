import { useState, useEffect } from 'react';
import status from '../../assets/imgs/boy.png';
import {
    Paper,
    Grid,
    Typography,
    TextField,
    Button,
    FormControl,
    FormControlLabel,
    Checkbox,
    Snackbar,
    Alert,
    LinearProgress,
} from '@mui/material';
import axios from '../../API/loginAPi'; // Adjust the import according to your file structure

const Settings = () => {
    const [adminName, setAdminName] = useState('');
    const [email, setEmail] = useState('');
    const [role,setRole] = useState('');
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch admin information
    useEffect(() => {
        const fetchAdminInfo = async () => {
            try {
                const response = await axios.get('/account'); 
                setRole(response.data.user.role)
                setAdminName(response.data.user.name);
                setEmail(response.data.user.email);
                setNotificationsEnabled(response.data.notificationsEnabled);
            } catch (error) {
                console.error('Error fetching admin information:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminInfo();
    }, []);

    const handleSaveSettings = async () => {
        try {
            // Send updated settings to your backend
            await axios.put('/admin/settings', {
                name: adminName,
                email: email,
                notificationsEnabled: notificationsEnabled,
            });
            setSuccessMessage('Settings saved successfully!');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error saving settings:', error);
            setSuccessMessage('Failed to save settings.');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    if (loading) {
        return <LinearProgress />;
    }

    return (
        <>
            <div className="nameCreate">
                <h1>Information Admin</h1>
            </div>
            <div style={{ padding: '20px' }}>
                <Grid container spacing={2}>
                    {/* Left Column: Admin Information */}
                    <Grid item xs={12} md={6}>
                        <Paper style={{ padding: '20px', borderRadius: '8px',display:"flex",flexDirection:"column", alignItems:"center"}}>
                            <Typography variant="h6" gutterBottom>
                                <div className="status">
                                    <img src={status} alt="status icon" />
                                </div>
                            </Typography>
                            <Typography variant="body1">
                                <strong>{role}</strong> 
                            </Typography>
                            <Typography variant="body1">
                                <strong>Name:</strong> {adminName}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Email:</strong> {email}
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Right Column: Editable Fields */}
                    <Grid item xs={12} md={6}>
                        <Paper style={{ padding: '20px', borderRadius: '8px' }}>
                            <Typography variant="h6" gutterBottom>
                                Edit Profile
                            </Typography>
                            <TextField
                                label="Edit Admin Name"
                                variant="outlined"
                                fullWidth
                                value={adminName}
                                onChange={(e) => setAdminName(e.target.value)}
                                style={{ marginBottom: '20px' }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    style: { padding: '10px' }, // Padding inside the input
                                }}
                            />
                            <TextField
                                label="Edit Email Address"
                                variant="outlined"
                                type="email"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ marginBottom: '20px' }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    style: { padding: '10px' }, // Padding inside the input
                                }}
                            />
                            <FormControl component="fieldset">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={notificationsEnabled}
                                            onChange={(e) => setNotificationsEnabled(e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label="Enable Notifications"
                                />
                            </FormControl>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSaveSettings}
                                style={{ marginTop: '20px' }} // Margin for button
                            >
                                Save Settings
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>

                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity={successMessage.includes('Failed') ? 'error' : 'success'}>
                        {successMessage}
                    </Alert>
                </Snackbar>
            </div>
        </>
    );
};

export default Settings;