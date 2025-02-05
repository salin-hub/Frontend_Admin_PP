import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    LinearProgress
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from '../../API/axios'; // Replace with your actual axios instance

const UserTable = () => {
    const [users, setUsers] = useState([]); // State to store users
    const [loading, setLoading] = useState(true); // State for loading indicator
    const [open, setOpen] = useState(false); // State for dialog open/close
    const [userIdToDelete, setUserIdToDelete] = useState(null); // ID of user to delete

    // Fetch user data from API
    const fetchUsers = async () => {
        try {
            const response = await axios.get('/accounts'); // Replace with your actual API endpoint
            setUsers(response.data.users); // Assuming the response has a "users" array
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false); // Stop the loading indicator
        }
    };

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, []); // Empty dependency array ensures this runs only once

    // Action handlers
    const handleEdit = (user) => {
        console.log('Edit user:', user);
        // Implement your edit logic here
    };

    const handleDeleteOpen = (userId) => {
        setUserIdToDelete(userId);
        setOpen(true);
    };

    const handleDeleteClose = () => {
        setOpen(false);
        setUserIdToDelete(null);
    };

    const handleDeleteConfirm = () => {
        if (userIdToDelete) {
            axios
                .delete(`/users/${userIdToDelete}`) // Replace with your actual API endpoint
                .then(() => {
                    setUsers(users.filter((user) => user.id !== userIdToDelete));
                    console.log('User deleted successfully');
                })
                .catch((error) => {
                    console.error('Error deleting user:', error);
                })
                .finally(() => {
                    handleDeleteClose(); // Close dialog after operation
                });
        }
    };

    return (
        <div style={{ height: "100vh", textAlign: "center", color: "black" }}>
            <div className="nameCreate" >
        <h1>User List</h1>
      </div>
            {loading ? (
                <LinearProgress sx={{ marginBottom: '20px' }} />
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align='center'>No</TableCell>
                                <TableCell align='center'>ID</TableCell>
                                <TableCell align='center'>Name</TableCell>
                                <TableCell align='center'>Email</TableCell>
                                <TableCell align='center'>Registration Date</TableCell>
                                <TableCell align='center'>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user, index) => (
                                <TableRow key={user.id}>
                                    <TableCell align="center">{index + 1}</TableCell>
                                    <TableCell align="center">{user.id}</TableCell>
                                    <TableCell align="center">{user.name}</TableCell>
                                    <TableCell align="center">{user.email}</TableCell>
                                    <TableCell align="center">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            onClick={() => handleEdit(user)}
                                            color="primary"
                                            startIcon={<Edit />}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => handleDeleteOpen(user.id)}
                                            color="secondary"
                                            startIcon={<Delete />}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Confirmation Dialog */}
            <Dialog open={open} onClose={handleDeleteClose}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this user? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default UserTable;