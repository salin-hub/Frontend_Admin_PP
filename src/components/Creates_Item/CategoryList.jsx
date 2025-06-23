import { useEffect, useState } from 'react';
import axios from '../../API/axios'; // Adjust the path to where your axios instance is defined
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
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
  Stack,
  InputAdornment,
  
  Box,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));
const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [expanded, setExpanded] = useState(null); // Track which category is expanded
  const [currentCategory, setCurrentCategory] = useState({ id: '', name: '', description: '', subcategory_id: '' });

  // Handle expansion of category
  const handleExpansion = (categoryId) => {
    setExpanded((prevExpanded) => (prevExpanded === categoryId ? null : categoryId)); // Toggle expansion
  };

  // Fetch categories and subcategories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/categories');
      setCategories(response.data.categories);
    } catch (error) {
      setError('Failed to load categories: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };
  const deleteCategory = async (id) => {
    try {
      await axios.delete(`/categories/${id}`);
      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      setError('Failed to delete category: ' + (error.response?.data?.message || error.message));
    }
  };
  const handleEditClick = (category) => {
    setCurrentCategory({
      id: category.id,
      name: category.name,
      description: category.description,
      subcategory_id: category.subcategory_id || '',
    });
    setEditMode(true);
  };
  const updateCategory = async () => {
    try {
      await axios.put(`/categories/${currentCategory.id}`, currentCategory);
      setCategories(categories.map((category) =>
        category.id === currentCategory.id ? currentCategory : category
      ));
      setEditMode(false);
    } catch (error) {
      setError('Failed to update category: ' + (error.response?.data?.message || error.message));
    }
  };
  // const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleCloseDialog = () => {
    setEditMode(false);
    setCurrentCategory({ id: '', name: '', description: '', subcategory_id: '' });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) return <LinearProgress sx={{ marginBottom: '20px' }} />;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <>
      <div className="nameCreate">
        <h1>Category List</h1>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TextField
            label="Search Book"
            variant="outlined"
            margin="normal"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search />
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
        </div>

        <TableContainer component={Paper} sx={{
          maxHeight: '68vh',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          }
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">No</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Subcategories</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.map((category, index) => (
                <TableRow key={category.id} >
                  <TableCell align="center" >{index + 1}</TableCell>
                  <TableCell align="center">
                    <Typography>
                      {category.name}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "400px",
                      cursor: "pointer",
                    }}
                    title={category.description}
                  >
                    {category.description}
                  </TableCell>
                  <TableCell align="center">
                    <Accordion expanded={expanded === category.id} onChange={() => handleExpansion(category.id)}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel-${category.id}-content`}
                        id={`panel-${category.id}-header`}
                      >
                        <Typography component="span" sx={{ "width": "150px" }}>View</Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ display: 'flex', flexDirection: 'column' }}>
                        {category.subcategories && category.subcategories.length > 0 ? (
                          <ul style={{ padding: 0, }}>
                            {category.subcategories.map((sub) => (
                              <li key={sub.id} style={{ display: "flex", alignItems: "center", justifyContent: "start", fontFamily: "Roboto, Nokora, sans-serif", fontSize: "15px", }} >
                                <Box sx={{ width: "100%" }}>
                                  <Stack
                                    sx={{
                                      padding: '0px',
                                      '&:hover': {
                                        padding: '1px',
                                        transition: 'padding 0.3s ease',
                                      },
                                      transition: 'padding 0.3s ease'
                                    }}
                                  >
                                    <Item sx={{ marginBottom: 1 }}>{sub.name}</Item>
                                  </Stack>
                                </Box>



                              </li>
                            ))}
                          </ul>
                        ) : (
                          <Typography variant="body2" color="textSecondary">No Subcategories</Typography>
                        )}
                      </AccordionDetails>


                    </Accordion>
                  </TableCell>
                  <TableCell align="center">
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
