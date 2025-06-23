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
  Box,
  InputAdornment
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Clear as ClearIcon } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState(null);

  const [newAuthor, setNewAuthor] = useState({
    name: '',
    email: '',
    description: '',
    image: '',
    imageFile: null
  });
  const confirmDelete = (author) => {
    setAuthorToDelete(author);
    setDeleteDialogOpen(true);
  };
  const handleImageChange = (event, type = 'create') => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      if (type === 'create') {
        setNewAuthor({ ...newAuthor, imageFile: file, image: imageURL });
      } else if (type === 'update') {
        setCurrentAuthor({ ...currentAuthor, imageFile: file, image: imageURL });
      }
    }
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`authors/${authorToDelete.id}`);
      setAuthors(authors.filter(author => author.id !== authorToDelete.id));
      setSuccessMessage('Author deleted successfully');
      setSnackbarOpen(true);
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error deleting author');
    } finally {
      setDeleteDialogOpen(false);
      setAuthorToDelete(null);
    }
  };


  const handleCreateSubmit = async () => {
    const formData = new FormData();
    formData.append('name', newAuthor.name);
    formData.append('email', newAuthor.email);
    formData.append('description', newAuthor.description);
    if (newAuthor.imageFile) {
      formData.append('image', newAuthor.imageFile);
    }

    try {
      setLoading(true);
      const response = await axios.post('authors', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setAuthors([...authors, response.data.author]);
      setSuccessMessage('Author created successfully');
      setSnackbarOpen(true);
      handleCreateClose();
      setNewAuthor({ name: '', email: '', description: '', image: '', imageFile: null });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create author');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOpen = () => setCreateDialogOpen(true);
  const handleCreateClose = () => {
    setCreateDialogOpen(false);
    setNewAuthor({ name: '', email: '', description: '', image: '', imageFile: null });
  };

  const handleCreateChange = (event) => {
    const { name, value } = event.target;
    setNewAuthor({ ...newAuthor, [name]: value });
  };

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

  const handleSearch = (value) => setSearchTerm(value);
  const handleUpdateOpen = (author) => {
    setCurrentAuthor(author);
    setUpdateDialogOpen(true);
  };

  const handleUpdateClose = () => setUpdateDialogOpen(false);

  const handleUpdateChange = (event) => {
    const { name, value } = event.target;
    setCurrentAuthor({ ...currentAuthor, [name]: value });
  };

  const handleUpdateSubmit = async () => {
    const formData = new FormData();
    formData.append('name', currentAuthor.name);
    formData.append('email', currentAuthor.email);
    formData.append('description', currentAuthor.description);

    if (currentAuthor.imageFile) {
      formData.append('image', currentAuthor.imageFile); // Image file is sent to backend
    }

    try {
      setLoading(true);

      const response = await axios.post(`authors/${currentAuthor.id}?_method=PUT`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setAuthors(authors.map(author =>
        author.id === currentAuthor.id ? response.data.author : author
      ));
      setSuccessMessage('Author updated successfully');
      setSnackbarOpen(true);
      handleUpdateClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating author');
    } finally {
      setLoading(false);
    }
  };


  const handleSnackbarClose = () => setSnackbarOpen(false);

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
        <Box display="flex" alignItems="center" justifyContent="center" mb={2} position="relative">
          <TextField
            sx={{ width: "400px" }}
            label="Search Author"
            variant="outlined"
            size="small"
            placeholder="search author by name..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleSearch('')} size="small" aria-label="clear search">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <div style={{ position: "absolute", right: 0 }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateOpen}>
              Create
            </Button>
          </div>
        </Box>

        <TableContainer component={Paper}  sx={{
          maxHeight: '71vh',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          }}}>
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
                    <IconButton aria-label="edit" onClick={() => handleUpdateOpen(author)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => confirmDelete(author)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete author <strong>{authorToDelete?.name}</strong>?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirmed} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={updateDialogOpen} onClose={handleUpdateClose}>
          <DialogTitle>Update Author</DialogTitle>
          <DialogContent>
            <DialogContentText>Update the details of the author.</DialogContentText>
            <TextField autoFocus margin="dense" name="name" label="Author Name" type="text" fullWidth variant="outlined" value={currentAuthor?.name || ''} onChange={handleUpdateChange} />
            <TextField margin="dense" name="email" label="Author Email" type="email" fullWidth variant="outlined" value={currentAuthor?.email || ''} onChange={handleUpdateChange} />
            <TextField margin="dense" name="description" label="Author Description" type="text" fullWidth variant="outlined" value={currentAuthor?.description || ''} onChange={handleUpdateChange} />
            <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
              Upload New Image
              <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, 'update')} />
            </Button>
            {currentAuthor?.image && (
              <Box mt={2} textAlign="center">
                <Avatar src={currentAuthor.image} sx={{ width: 80, height: 80, margin: 'auto' }} />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUpdateClose} color="primary">Cancel</Button>
            <Button onClick={handleUpdateSubmit} color="primary">Update</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={createDialogOpen} onClose={handleCreateClose}>
          <DialogTitle>Create Author</DialogTitle>
          <DialogContent>
            <DialogContentText>Enter the details of the new author.</DialogContentText>
            <TextField autoFocus margin="dense" name="name" label="Author Name" type="text" fullWidth variant="outlined" value={newAuthor.name} onChange={handleCreateChange} />
            <TextField margin="dense" name="email" label="Author Email" type="email" fullWidth variant="outlined" value={newAuthor.email} onChange={handleCreateChange} />
            <TextField margin="dense" name="description" label="Author Description" type="text" fullWidth variant="outlined" value={newAuthor.description} onChange={handleCreateChange} />
            <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
              Upload Author Image
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
            {newAuthor.image && (
              <Box mt={2} textAlign="center">
                <Avatar src={newAuthor.image} sx={{ width: 80, height: 80, margin: 'auto' }} />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCreateClose} color="primary">Cancel</Button>
            <Button onClick={handleCreateSubmit} color="primary">Create</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default AuthorList;