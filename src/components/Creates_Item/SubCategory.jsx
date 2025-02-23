import { useEffect, useState } from 'react';
import axios from '../../API/axios'; // Adjust the path to where your axios instance is defined
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  LinearProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ id: '', name: '', description: '' });
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/categories');
      setCategories(response.data.categories); // Set categories from response
    } catch (error) {
      // Check for error response to provide more specific feedback
      if (error.response) {
        setError(`Failed to loading categories: ${error.response.data.message || error.message}`);
      } else {
        setError('Failed to loading categories: An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete category from API
  const deleteCategory = async (id) => {
    try {
      await axios.delete(`/categories/${id}`);
      setCategories(categories.filter((category) => category.id !== id)); // Remove the deleted category from state
    } catch (error) {
      // Check for error response to provide more specific feedback
      if (error.response) {
        setError(`Failed to delete categories: ${error.response.data.message || error.message}`);
      } else {
        setError('Failed to Delete categories: An unexpected error occurred');
      }
    }
  };

  // Edit category - Open dialog for editing
  const handleEditClick = (category) => {
    setCurrentCategory({ id: category.id, name: category.name, description: category.description });
    setEditMode(true);
  };

  // Update category
  const updateCategory = async () => {
    try {
      await axios.put(`/categories/${currentCategory.id}, currentCategory`);

      // Update the categories state
      setCategories(categories.map((category) =>
        category.id === currentCategory.id ? currentCategory : category
      ));

      setEditMode(false); // Close dialog after update
    } catch (error) {
      if (error.response) {
        setError(`Failed to update category: ${error.response.data.message || error.message}`);
      } else {
        setError('Failed to update category: An unexpected error occurred');
      }
    }
  };

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close the edit dialog without saving
  const handleCloseDialog = () => {
    setEditMode(false);
    setCurrentCategory({ id: '', name: '', description: '' });
  };

  useEffect(() => {
    fetchCategories(); // Fetch categories on mount
  }, []);

  // if (loading) return <p>Loading categories...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <>
      <div className="nameCreate" >
        <h1>Category List</h1>
      </div>
      {loading && <LinearProgress sx={{ marginBottom: '20px' }} />}
      <div style={{ padding: '20px' }}>
        <TextField
          variant="outlined"
          placeholder="Search category name"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ marginBottom: '20px' }}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow >
                <TableCell align='center'>No</TableCell>
                <TableCell align='center'>Category Name</TableCell>
                <TableCell align='center'>Category Description</TableCell>
                <TableCell align='center'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.map((category, index) => (
                <TableRow key={category.id}>
                  <TableCell align='center'>{index + 1}</TableCell>
                  <TableCell align='center'>{category.name}</TableCell>
                  <TableCell align='center' sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "300px",
                    cursor: "pointer",
                  }}>{category.description}</TableCell>
                  <TableCell align='center'>
                    <IconButton aria-label="edit" onClick={() => handleEditClick(category)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => deleteCategory(category.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Edit Category Dialog */}
        <Dialog open={editMode} onClose={handleCloseDialog}>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogContent>
            <TextField
              label="Category Name"
              fullWidth
              value={currentCategory.name}
              onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
              margin="normal"
            />
            <TextField
              label="Category Description"
              fullWidth
              value={currentCategory.description}
              onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
            <Button onClick={updateCategory} color="primary">Save</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default CategoryList;