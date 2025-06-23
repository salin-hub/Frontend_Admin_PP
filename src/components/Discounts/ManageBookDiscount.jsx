import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    CircularProgress,
    TablePagination,
    Button,
    Stack,
    Dialog,
    TextField,
    MenuItem,
    Alert
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

import axios from "../../API/axios";

const DiscountedBooksTable = () => {
    const [books, setBooks] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [updatedPercentage, setUpdatedPercentage] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDiscountedBooks();
    }, []);

    const fetchDiscountedBooks = async () => {
        try {
            const [booksRes, discountsRes] = await Promise.all([
                axios.get("/getBookDiscounts"),
                axios.get("/getDiscount")
            ]);
            setBooks(booksRes.data.Discounts);
            setDiscounts(discountsRes.data.discount_List);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching discounted books:", error);
            setLoading(false);
        }
    };

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRemoveDiscount = async (bookId) => {
        if (!window.confirm("Are you sure you want to remove this discount?")) return;
        try {
            await axios.delete(`/discount-book/${bookId}`);
            fetchDiscountedBooks();
        } catch (error) {
            console.error("Failed to remove discount:", error);
        }
    };

    const openUpdateDialogHandler = (book) => {
        setSelectedBook(book);
        setUpdatedPercentage(book.discount_id);
        setOpenUpdateDialog(true);
        setSuccess(false);
        setError("");
    };

    const handleUpdateDiscount = async () => {
        try {
            await axios.put(`/discount-book/${selectedBook.book_id}`, {
                discount_id: updatedPercentage,
            });
            setSuccess(true);
            setOpenUpdateDialog(false);
            fetchDiscountedBooks();
        } catch (error) {
            console.error("Failed to update discount:", error);
            setError("Failed to update discount");
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={5}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom color="black">
                Discounted Books
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableRow>
                            <TableCell>Image</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Original Price</TableCell>
                            <TableCell align="right">Discount %</TableCell>
                            <TableCell align="right">Discount Amount</TableCell>
                            <TableCell align="right">Discounted Price</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {books
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((book) => (
                                <TableRow key={book.book_id}>
                                    <TableCell>
                                        <Avatar
                                            variant="rounded"
                                            src={book.book_image}
                                            alt={book.book_title}
                                            sx={{ width: 56, height: 75 }}
                                        />
                                    </TableCell>
                                    <TableCell>{book.book_title}</TableCell>
                                    <TableCell>{book.book_description.slice(0, 80)}...</TableCell>
                                    <TableCell align="right">${parseFloat(book.original_price).toFixed(2)}</TableCell>
                                    <TableCell align="right">{parseFloat(book.discount_percentage).toFixed(2)}%</TableCell>
                                    <TableCell align="right">${parseFloat(book.discount_amount).toFixed(2)}</TableCell>
                                    <TableCell align="right">
                                        <Typography fontWeight="bold" color="success.main">
                                            ${parseFloat(book.discounted_price).toFixed(2)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            <IconButton
                                                color="primary"
                                                size="small"
                                                onClick={() => openUpdateDialogHandler(book)}
                                                aria-label="update discount"
                                            >
                                                <EditIcon />
                                            </IconButton>

                                            <IconButton
                                                color="error"
                                                size="small"
                                                onClick={() => handleRemoveDiscount(book.book_id)}
                                                aria-label="remove discount"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>

                                </TableRow>
                            ))}
                    </TableBody>
                </Table>

                <TablePagination
                    component="div"
                    count={books.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </TableContainer>

            {/* Update Dialog */}
            <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)}>
                <Box
                    component="form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdateDiscount();
                    }}
                    sx={{ p: 3, width: 400 }}
                >
                    <Typography variant="h6" gutterBottom textAlign="center">
                        Update Discount for Book
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>Discount updated successfully!</Alert>}

                    <TextField
                        fullWidth
                        label="Book Title"
                        value={selectedBook?.book_title || ""}
                        margin="normal"
                        InputProps={{ readOnly: true }}
                    />

                    <TextField
                        fullWidth
                        select
                        label="Select Discount"
                        name="discount_id"
                        value={updatedPercentage}
                        onChange={(e) => setUpdatedPercentage(e.target.value)}
                        margin="normal"
                        required
                    >
                        {discounts.map((discount) => (
                            <MenuItem key={discount.discount_id} value={discount.discount_id}>
                                {discount.discount_percentage}%
                            </MenuItem>
                        ))}
                    </TextField>

                    <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
                        <Button onClick={() => setOpenUpdateDialog(false)}>Cancel</Button>
                        <Button type="submit" variant="contained">Save</Button>
                    </Stack>
                </Box>
            </Dialog>
        </Box>
    );
};

export default DiscountedBooksTable;
