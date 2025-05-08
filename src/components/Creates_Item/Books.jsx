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
    DialogTitle,
    DialogContent,
    TextField,
    IconButton,
    LinearProgress,
    InputAdornment
} from '@mui/material';

import { FaStar, FaRegStar } from "react-icons/fa";
import { Edit, Delete, Search } from '@mui/icons-material';
import axios from '../../API/axios';

const BookTable = () => {
    const [booksData, setBooksData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [currentBook, setCurrentBook] = useState(null);
    const [editBook, setEditBook] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');


    const fetchBooks = async () => {
        try {
            setLoading(true);
            const [booksRes, categoriesRes, authorsRes] = await Promise.all([
                axios.get('/getbooks'),
                axios.get('/categories'),
                axios.get('/getauthors'),
            ]);
            setBooksData(booksRes.data.books.reverse());
            setCategories(categoriesRes.data.categories);
            setAuthors(authorsRes.data.authors);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rating ? <FaStar key={i} color="#FFD700" /> : <FaRegStar key={i} color="#FFD700" />);
        }
        return stars;
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleDelete = async (book) => {
        try {
            await axios.delete(`/books/${book.id}`);
            setBooksData((prevBooks) => prevBooks.filter((b) => b.id !== book.id));
            setDeleteConfirmOpen(false);
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    const handleEditOpen = (book) => {
        setEditBook(book);
        setEditOpen(true);
    };

    const handleEditSave = async () => {
        try {
            const updatedBook = {
                title: editBook.title,
                description: editBook.description || '',
                author_id: editBook.author_id,
                category_id: editBook.category_id,
                publisher: editBook.publisher || '',
                publish_date: editBook.publish_date || '',
                pages: editBook.pages || '',
                dimensions: editBook.dimensions || '',
                language: editBook.language || '',
                ean: editBook.ean || '',
                price_handbook: editBook.price_handbook || '',
            };
            if (editBook.cover_path instanceof File) {
                updatedBook.cover_path = editBook.cover_path;
            }
            console.log('updatedBook before submitting:', updatedBook);
            const response = await axios.put(`/books/${editBook.id}`, updatedBook, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response:', response.data);
            fetchBooks();
            setEditOpen(false);
        } catch (error) {
            console.error('Error updating book:', error.response?.data || error.message);
            if (error.response?.data?.errors) {
                console.log('Validation Errors:', error.response.data.errors);
            }
        }
    };
    const filteredBooks = booksData.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div style={{ position: 'relative', overflowX: 'auto', whiteSpace: 'nowrap' }}>
            <div className="nameCreate">
                <h1>Books List</h1>
            </div>
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
            {loading && <LinearProgress sx={{ marginBottom: '20px' }} />}
            <TableContainer component={Paper} sx={{
                maxHeight: '70vh',
                overflowY: 'auto',
                scrollbarWidth: 'auto',
                '&::-webkit-scrollbar': {
                    display: 'none',
                },
            }}>
                <Table stickyHeader>
                    <TableHead >
                        <TableRow>
                            <TableCell align='center'>No</TableCell>
                            <TableCell align='center'>Book Image</TableCell>
                            <TableCell align='center'>Book Name</TableCell>
                            <TableCell align='center'>Book Category</TableCell>
                            <TableCell align='center'>Book Author</TableCell>
                            <TableCell align='center'>Description</TableCell>
                            <TableCell align='center'>Price</TableCell>
                            <TableCell align='center'>Publisher</TableCell>
                            <TableCell align='center'>Publish Date</TableCell>
                            <TableCell align='center'>Pages</TableCell>
                            <TableCell align='center'>Dimensions</TableCell>
                            <TableCell align='center'>Language</TableCell>
                            <TableCell align='center'>EAN/UPC</TableCell>
                            <TableCell align='center'>Discount</TableCell>
                            <TableCell align='center'>Review</TableCell>
                            <TableCell align='center'>Rating</TableCell>
                            <TableCell align='center'>Stock</TableCell>
                            <TableCell align='center'>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredBooks.map((book, index) => (
                            <TableRow key={book.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    <img
                                        src={book.cover_path}
                                        alt={book.title}
                                        style={{ width: '50px', height: 'auto' }}
                                    />
                                </TableCell>
                                <TableCell
                                    sx={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "200px",
                                        cursor: "pointer",
                                    }}
                                    title={book.title}
                                >
                                    {book.title}
                                </TableCell>
                                <TableCell sx={{ color: "red" }}>{book.category.name}</TableCell>
                                <TableCell>{book.author.name}</TableCell>
                                <TableCell
                                    sx={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "500px",
                                        cursor: "pointer",
                                    }}
                                    title={book.description}
                                >
                                    {book.description}
                                </TableCell>

                                <TableCell sx={{ color: "red" }}>{book.discounted_price && book.discounted_price < book.original_price ? (
                                    <div style={{ "display": "flex", "flexDirection": "column" }}>
                                        <span style={{ textDecoration: "line-through", color: "gray", marginRight: "10px" }}>
                                            USD {book.original_price}
                                        </span>
                                        <span style={{ fontWeight: "bold", color: "red" }}>
                                            USD {book.discounted_price}
                                        </span>
                                    </div>
                                ) : (
                                    <span style={{ fontWeight: "bold" }}>USD {book.original_price}</span>
                                )}</TableCell>
                                <TableCell align='center'>{book.publisher}</TableCell>
                                <TableCell >{book.publish_date}</TableCell>
                                <TableCell>{book.pages}</TableCell>
                                <TableCell>{book.dimensions}</TableCell>
                                <TableCell>{book.language}</TableCell>
                                <TableCell>{book.ean}</TableCell>
                                <TableCell sx={{ color: "red" }}>{book.discount && book.discount.discount_percentage > 0 && (
                                    <div>
                                        {book.discount.discount_percentage}% OFF
                                    </div>
                                )}</TableCell>
                                <TableCell sx={{ "textAlign": "center" }}>{book.reviewcount}</TableCell>
                                <TableCell>{renderStars(book.ratingCount)}</TableCell>
                                <TableCell align='center'><span
                                    style={{
                                        color: !book.quantity || book.quantity < 5 ? 'red' : 'black',
                                        fontWeight: !book.quantity ? 'bold' : 'normal'
                                    }}
                                >
                                    {!book.quantity ? 'Unavailable' : book.quantity}
                                </span></TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEditOpen(book)} >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        aria-label="delete"
                                        onClick={() => {
                                            setDeleteConfirmOpen(true);
                                            setCurrentBook(book);
                                        }}
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
                <DialogTitle>Edit Book</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Title"
                        value={editBook?.title || ''}
                        onChange={(e) => setEditBook({ ...editBook, title: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Description"
                        value={editBook?.description || ''}
                        onChange={(e) => setEditBook({ ...editBook, description: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Author"
                        select
                        SelectProps={{ native: true }}
                        value={editBook?.author_id || ''}
                        onChange={(e) => setEditBook({ ...editBook, author_id: e.target.value })}
                        fullWidth
                        margin="dense"
                    >
                        <option value="">Select Author</option>
                        {authors.map((author) => (
                            <option key={author.id} value={author.id}>
                                {author.name}
                            </option>
                        ))}
                    </TextField>
                    <TextField
                        label="Category"
                        select
                        SelectProps={{ native: true }}
                        value={editBook?.category_id || ''}
                        onChange={(e) => setEditBook({ ...editBook, category_id: e.target.value })}
                        fullWidth
                        margin="dense"
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </TextField>
                    <TextField
                        label="Publisher"
                        value={editBook?.publisher || ''}
                        onChange={(e) => setEditBook({ ...editBook, publisher: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Publish Date"
                        type="date"
                        value={editBook?.publish_date || ''}
                        onChange={(e) => setEditBook({ ...editBook, publish_date: e.target.value })}
                        fullWidth
                        margin="dense"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Pages"
                        type="number"
                        value={editBook?.pages || ''}
                        onChange={(e) => setEditBook({ ...editBook, pages: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Dimensions"
                        value={editBook?.dimensions || ''}
                        onChange={(e) => setEditBook({ ...editBook, dimensions: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Language"
                        value={editBook?.language || ''}
                        onChange={(e) => setEditBook({ ...editBook, language: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="EAN/UPC"
                        value={editBook?.ean || ''}
                        onChange={(e) => setEditBook({ ...editBook, ean: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Price"
                        type="number"
                        value={editBook?.original_price || ''}
                        onChange={(e) => setEditBook({ ...editBook, original_price: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        type="file"
                        inputProps={{ accept: 'image/*' }}
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setEditBook({ ...editBook, cover_path: file });
                        }}
                        fullWidth
                        margin="dense"
                    />
                    {editBook?.cover_path && !(editBook.cover_path instanceof File) && (
                        <img
                            src={editBook.cover_path}
                            alt="Book Cover"
                            style={{ width: '100px', marginTop: '10px' }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleEditSave} color="secondary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
            >
                <DialogTitle>Are you sure you want to delete this book?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleDelete(currentBook)} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>


        </div>
    );
};

export default BookTable;
