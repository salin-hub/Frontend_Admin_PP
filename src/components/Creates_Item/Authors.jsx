import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Avatar,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  LinearProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from '../../API/axios';

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch authors on component mount
  useEffect(() => {
    const fetchAuthors = async () => {
      setLoading(true);
      try {
        const response = await axios.get('getauthors');
        setAuthors(response.data.authors);
      } catch (err) {
        setError(err.response ? err.response.data.message : 'An error occurred while fetching authors');
      } finally {
        setLoading(false);
      }
    };
    fetchAuthors();
  }, []);

  // Search filter
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Delete author
  const handleDelete = async (id) => {
    try {
      await axios.delete(`authors/${id}`);
      setAuthors(authors.filter(author => author.id !== id));
      setSuccessMessage('Author deleted successfully');
      setSnackbarOpen(true);
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error deleting author');
    }
  };

  // Open update dialog with the selected author's details
  const handleUpdateOpen = (author) => {
    setCurrentAuthor(author);
    setUpdateDialogOpen(true);
  };

  // Close update dialog
  const handleUpdateClose = () => {
    setUpdateDialogOpen(false);
  };

  // Handle input changes in the update dialog
  const handleUpdateChange = (event) => {
    const { name, value } = event.target;
    setCurrentAuthor({ ...currentAuthor, [name]: value });
  };

  // Submit the update
  const handleUpdateSubmit = async () => {
    const updatedData = {
      name: currentAuthor.name,
      email: currentAuthor.email,
      description: currentAuthor.description,
    };

    try {
      setLoading(true); // Show loading indicator
      const response = await axios.put(
        `authors/${currentAuthor.id}`,
        updatedData
      );

      // Update the authors list with the updated author
      setAuthors(authors.map(author =>
        author.id === currentAuthor.id ? response.data.author : author
      ));

      setSuccessMessage('Author updated successfully');
      setSnackbarOpen(true);
      handleUpdateClose(); // Close the update dialog
    } catch (err) {
      setError(err.response ? err.response.data.error : 'Error updating author');
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Close Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Filter authors by search term
  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="nameCreate">
        <h1>Authors List</h1>
      </div>
      {loading && <LinearProgress sx={{ marginBottom: '20px' }} />}
      <div style={{ padding: '20px' }}>
        {error && <div>Error: {error}</div>}
        {successMessage && (
          <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
            <Alert onClose={handleSnackbarClose} severity="success">
              {successMessage}
            </Alert>
          </Snackbar>
        )}
        <TextField
          variant="outlined"
          placeholder="Search author name"
          fullWidth
          style={{ marginBottom: '20px' }}
          value={searchTerm}
          onChange={handleSearch}
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Profile</TableCell>
                <TableCell>Author Name</TableCell>
                <TableCell>Author Email</TableCell>
                <TableCell>Author Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAuthors.map((author, index) => (
                <TableRow key={author.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Avatar
                      alt={author.name}
                      src={author.image}
                      sx={{ background: 'red', width: 56, height: 56 }}
                    >
                      {!author.image && author.name.charAt(0)}
                    </Avatar>
                  </TableCell>
                  <TableCell>{author.name}</TableCell>
                  <TableCell>{author.email}</TableCell>
                  <TableCell sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "300px",
                    cursor: "pointer",
                  }}>{author.description}</TableCell>
                  <TableCell>
                    {/* <IconButton aria-label="view">
                      <VisibilityIcon />
                    </IconButton> */}
                    <IconButton aria-label="edit" onClick={() => handleUpdateOpen(author)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => handleDelete(author.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Update Dialog */}
        <Dialog open={updateDialogOpen} onClose={handleUpdateClose}>
          <DialogTitle>Update Author</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Update the details of the author.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Author Name"
              type="text"
              fullWidth
              variant="outlined"
              value={currentAuthor?.name || ''}
              onChange={handleUpdateChange}
            />
            <TextField
              margin="dense"
              name="email"
              label="Author Email"
              type="email"
              fullWidth
              variant="outlined"
              value={currentAuthor?.email || ''}
              onChange={handleUpdateChange}
            />
            <TextField
              margin="dense"
              name="description"
              label="Author Description"
              type="text"
              fullWidth
              variant="outlined"
              value={currentAuthor?.description || ''}
              onChange={handleUpdateChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUpdateClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUpdateSubmit} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default AuthorList;
