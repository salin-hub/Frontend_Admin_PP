import { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Tooltip, IconButton, Box, TextField, InputAdornment, CircularProgress
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import SearchIcon from '@mui/icons-material/Search';
import axios from '../API/loginAPi';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [role] = useState('admin');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/accounts');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('There was an error fetching the user data.');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, isActive) => {
    try {
      const response = await axios.put(`/users/${userId}/status`, { is_active: isActive });
      console.log(response.data.message); 
    
      fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
      setError('There was an error updating the user status.');
    }
  };

  const filteredUsers = users.filter(user =>
    user.id.toLowerCase().includes(search.toLowerCase()) ||
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="nameCreate">
        <h1>User List</h1>
      </div>
      {error && <Typography color="error" sx={{ textAlign: 'center', mb: 2 }}>{error}</Typography>}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by ID or Name"
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>User</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Role</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Action</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Typography variant="body1">{user.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {user.role}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {user.is_active ? (
                      <Tooltip title="Active">
                        <CheckCircleIcon color="success" />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Inactive">
                        <CancelIcon color="disabled" />
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell>
                    {/* Allow admins to toggle status on all users */}
                    <Tooltip title={user.is_active ? 'Deactivate Account' : 'Activate Account'}>
                      <IconButton
                        color={user.is_active ? 'error' : 'success'}
                        onClick={() => toggleUserStatus(user.id, !user.is_active)}
                        disabled={role !== 'admin'}  // Only allow admin to change the status
                      >
                        {user.is_active ? <LockIcon /> : <LockOpenIcon />}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default UserTable;
