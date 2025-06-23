import { useEffect, useState } from 'react';
import {
  Box, Typography, CircularProgress, Stack, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, InputAdornment, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Add as AddIcon
} from '@mui/icons-material';
import axios from '../../API/axios';

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const [filteredBanners, setFilteredBanners] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    id: null, title: '', description: '', books_id: '', image_url: null
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchBanners();
    fetchBooks();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      setFilteredBanners(banners.filter(b => b.title.toLowerCase().includes(query)));
    } else {
      setFilteredBanners(banners);
    }
  }, [searchQuery, banners]);

  const fetchBanners = () => {
    axios.get('/banners')
      .then(res => {
        setBanners(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load banners');
        setLoading(false);
      });
  };

  const fetchBooks = () => {
    axios.get('/getbooks')
      .then(res => setBooks(res.data.books))
      .catch(() => console.log('Failed to load books'));
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/banners/${id}`);
      setBanners(prev => prev.filter(b => b.id !== id));
    } catch {
      alert('Failed to delete banner');
    } finally {
      setConfirmDialog({ open: false, id: null });
    }
  };

  const handleEditOpen = (banner) => {
    setEditing(true);
    setFormData({
      id: banner.id,
      title: banner.title,
      description: banner.description,
      books_id: banner.books_id,
      image_url: banner.image_url
    });
    setDialogOpen(true);
  };

  const handleCreateOpen = () => {
    setEditing(false);
    setFormData({ id: null, title: '', description: '', books_id: '', image_url: null });
    setDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image_url') {
      if (files.length > 0) {
        setFormData(prev => ({ ...prev, image_url: files[0] }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setProcessing(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description || '');
    data.append('books_id', formData.books_id);
    if (formData.image_url instanceof File) {
      data.append('image_url', formData.image_url);
    }

    try {
      if (editing) {
        await axios.post(`/banners/${formData.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
          params: { _method: 'PUT' }
        });
      } else {
        await axios.post('/banners', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      fetchBanners();
      setDialogOpen(false);
    } catch (error) {
      console.error('Submit error:', error);
      alert(`Failed to ${editing ? 'update' : 'create'} banner`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div style={{height:"100%",display:"flex"}}><CircularProgress sx={{ display: 'block', mx: 'auto', mt: 5 }} /></div>;
  if (error) return <Typography color="error" align="center" mt={5}>{error}</Typography>;

  return (
    <Box sx={{ maxWidth: 1250, mx: 'auto', mt: 4, padding:"20px"}}>
      
      <Stack direction="row" justifyContent="space-between" alignItems="center" >
        <Typography variant="h4" sx={{ color: "black" }}>Banner List</Typography>
      </Stack>

      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <TextField
          label="Search Book"
          variant="outlined"
          margin="normal"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            width: '50%',
            borderRadius: '10px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
            },
            '& .MuiOutlinedInput-root.Mui-focused': {
              borderColor: 'primary.main',
            }
          }}
        />
        <div style={{ position: "absolute", right: 0 }}><Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateOpen}>
          Create
        </Button></div>
      </div>

      <TableContainer component={Paper}  sx={{
          maxHeight: '62vh',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          }}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Book</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBanners.map((banner) => (
              <TableRow key={banner.id}>
                <TableCell>
                  <Avatar variant="rounded" src={banner.image_url} alt={banner.title} sx={{ width: 70, height: 50 }} />
                </TableCell>
                <TableCell>{banner.title}</TableCell>
                <TableCell>{banner.description || 'No description'}</TableCell>
                <TableCell>{banner.book?.title || 'Unknown'}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEditOpen(banner)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => setConfirmDialog({ open: true, id: banner.id })} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirm Delete */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, id: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this banner?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, id: null })}>Cancel</Button>
          <Button onClick={() => handleDelete(confirmDialog.id)} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Edit Banner' : 'Create Banner'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            label="Book"
            name="books_id"
            value={formData.books_id}
            onChange={handleInputChange}
            select
            fullWidth
            margin="normal"
          >
            {books.map((book) => (
              <MenuItem key={book.id} value={book.id}>
                {book.title}
              </MenuItem>
            ))}
          </TextField>

          <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
            {editing ? 'Upload New Image' : 'Upload Image'}
            <input type="file" name="image_url" accept="image/*" hidden onChange={handleInputChange} />
          </Button>

          {formData.image_url && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2">Image Preview:</Typography>
              <Box
                component="img"
                src={
                  formData.image_url instanceof File
                    ? URL.createObjectURL(formData.image_url)
                    : formData.image_url
                }
                alt="Banner"
                sx={{ width: '100%', maxHeight: 200, objectFit: 'cover', mt: 1, borderRadius: 1 }}
              />
              {!(formData.image_url instanceof File) && (
                <Typography variant="caption" color="text.secondary">
                  Showing existing image
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={processing}
            startIcon={processing && <CircularProgress size={20} />}
          >
            {processing ? (editing ? 'Updating' : 'Creating') : editing ? 'Update' : 'Create'}
          </Button>

        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BannerList;
