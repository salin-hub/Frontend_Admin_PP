import { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
    Typography, IconButton, LinearProgress, Box, InputAdornment
} from '@mui/material';
import { Edit,Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import axios from '../API/axios';

const StockManager = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBook, setSelectedBook] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [searchText, setSearchText] = useState('');

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/getbooks');
            setBooks(response.data.books.reverse());
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);
    const handleEditClick = (book) => {
        setSelectedBook({ ...book });
        setOpenEditDialog(true);
    };

    const handleEditSave = async () => {
        try {
            await axios.put(`/updatestock/${selectedBook.id}`, {
                quantity: selectedBook.quantity,
            });
    
            // Update local state with the updated book quantity
            setBooks(books.map(book =>
                book.id === selectedBook.id ? { ...book, quantity: selectedBook.quantity } : book
            ));
    
            setOpenEditDialog(false);
            alert('Stock updated successfully!');
        } catch (error) {
            console.error('Error saving book details:', error);
            alert('Failed to save changes.');
        }
    };
    

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchText.toLowerCase())
    );

    if (loading) return <LinearProgress />;

    return (
        <div style={{ padding: "20px" }}>
            <div className="nameCreate">
                <h1>Stock Management</h1>
            </div>
            <Box display="flex" justifyContent="center" mb={2}>
                <TextField
                    sx={{ width: "400px" }}
                    label="Search Books by Title"
                    variant="outlined"
                    size="small"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        endAdornment: searchText && (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setSearchText('')} size="small">
                                    <ClearIcon />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
            </Box>

            <Typography variant="body2" color="textSecondary" gutterBottom>
                {filteredBooks.length} {filteredBooks.length === 1 ? 'book found' : 'books found'}
            </Typography>

            <TableContainer component={Paper} sx={{ maxHeight: '65vh' }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell align="center">Price (USD)</TableCell>
                            <TableCell align="center">Stock</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredBooks.length > 0 ? (
                            filteredBooks.map((book, index) => (
                                <TableRow key={book.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <img
                                            src={book.cover_path}
                                            alt={book.title}
                                            style={{ width: '50px', height: 'auto', borderRadius: '4px' }}
                                        />
                                    </TableCell>
                                    <TableCell>{book.title}</TableCell>
                                    <TableCell align="center">
                                        {book.discounted_price && book.discounted_price < book.price_handbook ? (
                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                <span style={{ textDecoration: "line-through", color: "gray" }}>
                                                    ${book.price_handbook}
                                                </span>
                                                <span style={{ fontWeight: "bold", color: "red" }}>
                                                    ${book.discounted_price}
                                                </span>
                                            </div>
                                        ) : (
                                            <span style={{ fontWeight: "bold" }}>
                                                ${book.price_handbook}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        <span
                                            style={{
                                                color: !book.quantity || book.quantity < 5 ? 'red' : 'black',
                                                fontWeight: !book.quantity ? 'bold' : 'normal'
                                            }}
                                        >
                                            {!book.quantity ? 'Unavailable' : book.quantity}
                                        </span>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => handleEditClick(book)}>
                                            <Edit color="primary" />
                                        </IconButton>
                                        
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No books match your search.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit Dialog */}
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>Update Stock</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Title"
                        fullWidth
                        margin="dense"
                        value={selectedBook?.title || ''}
                        disabled // 🔒 make this field read-only
                    />
                    <TextField
                        label="Price (USD)"
                        fullWidth
                        type="number"
                        margin="dense"
                        value={selectedBook?.original_price || ''}
                        disabled // 🔒 make this field read-only
                    />
                    <TextField
                        label="Quantity"
                        fullWidth
                        type="number"
                        margin="dense"
                        inputProps={{ min: 0 }}
                        value={selectedBook?.quantity || ''}
                        onChange={(e) => {
                            const value = Math.max(0, parseInt(e.target.value, 10) || 0);
                            setSelectedBook({ ...selectedBook, quantity: value });
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditSave} variant="contained" color="primary">
                        Save
                    </Button>
                    <Button onClick={() => setOpenEditDialog(false)} variant="outlined" color="error">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default StockManager;
