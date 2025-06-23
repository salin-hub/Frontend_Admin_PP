import { useEffect, useState } from "react";
import axios_api from "../../API/axios";
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert,
    Button,
    TextField,
    Modal,
    Box,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Snackbar,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Add as AddIcon } from '@mui/icons-material';

const DiscountList = () => {
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [currentDiscount, setCurrentDiscount] = useState(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [updatedDiscount, setUpdatedDiscount] = useState({
        discount_percentage: "",
        start_date: null,
        end_date: null,
        description: "",
    });
    const [newDiscount, setNewDiscount] = useState({
        discount_percentage: "",
        start_date: null,
        end_date: null,
        description: "",
    });

    // Snackbar state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    useEffect(() => {
        fetchDiscounts();
    }, []);

    const handleCreate = () => {
        if (!newDiscount.discount_percentage || !newDiscount.start_date || !newDiscount.end_date) {
            setError("Please fill all fields.");
            return;
        }

        const formattedNew = {
            ...newDiscount,
            start_date: newDiscount.start_date.format("YYYY-MM-DD"),
            end_date: newDiscount.end_date.format("YYYY-MM-DD"),
        };

        axios_api.post("/createDiscount", formattedNew)
            .then((response) => {
                setDiscounts([...discounts, response.data]);
                setCreateOpen(false);
                setSnackbarMessage("Create discount successfully!");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
            })
            .catch((error) => setError(error.message));
    };
    const fetchDiscounts = () => {
        setLoading(true);
        axios_api
            .get("/getDiscount")
            .then((response) => {
                setDiscounts(response.data.discount_List);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setConfirmDialogOpen(true);
    };

    const confirmDelete = () => {
        axios_api
            .delete(`/deleteDiscount/${deleteId}`)
            .then(() => {
                setDiscounts(discounts.filter((discount) => discount.discount_id !== deleteId));
                setConfirmDialogOpen(false);
                setSnackbarMessage("Discount deleted successfully!");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
            })
            .catch((error) => {
                setError(error.message);
                setConfirmDialogOpen(false);
            });
    };

    const handleUpdate = (id) => {
        const discountToUpdate = discounts.find((discount) => discount.discount_id === id);
        setCurrentDiscount(discountToUpdate);
        setUpdatedDiscount({
            discount_percentage: discountToUpdate.discount_percentage,
            start_date: dayjs(discountToUpdate.start_date),
            end_date: dayjs(discountToUpdate.end_date),
            description: discountToUpdate.description || "",
        });
        setOpen(true);
    };

    const handleModalClose = () => {
        setOpen(false);
        setCurrentDiscount(null);
    };

    const handleSubmitUpdate = () => {
        if (
            updatedDiscount.discount_percentage === "" ||
            !updatedDiscount.start_date ||
            !updatedDiscount.end_date
        ) {
            setError("Please fill all fields.");
            return;
        }
        const formattedDiscount = {
            ...updatedDiscount,
            start_date: updatedDiscount.start_date.format("YYYY-MM-DD"),
            end_date: updatedDiscount.end_date.format("YYYY-MM-DD"),
        };

        axios_api
            .put(`/updateDiscount/${currentDiscount.discount_id}`, formattedDiscount)
            .then((response) => {
                setDiscounts(
                    discounts.map((discount) =>
                        discount.discount_id === currentDiscount.discount_id ? response.data : discount
                    )
                );
                setOpen(false);
                setCurrentDiscount(null);
                setSnackbarMessage("Discount updated successfully!");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === "clickaway") return;
        setSnackbarOpen(false);
    };

    return (
        <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Container>
                <Box display="flex" alignItems="center" mb={2} position="relative" mt="20px">
                    <Typography variant="h6" gutterBottom sx={{ fontFamily: 'system-ui', color: 'black' }}>
                        Discount List
                    </Typography>
                    <div style={{ position: "absolute", right: 0 }}>
                        <Button variant="contained"  startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
                            Create
                        </Button>
                    </div>
                </Box>

                {loading && <CircularProgress />}
                {error && <Alert severity="error">{error}</Alert>}
                {!loading && !error && (
                    <TableContainer component={Paper} sx={{ paddingRight: "20px" }} fullWidth>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Discount Percentage</TableCell>
                                    <TableCell>Start Date</TableCell>
                                    <TableCell>End Date</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {discounts.map((discount, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{discount.discount_id}</TableCell>
                                        <TableCell>{discount.discount_percentage}%</TableCell>
                                        <TableCell>{discount.start_date}</TableCell>
                                        <TableCell>{discount.end_date}</TableCell>
                                        <TableCell
                                            sx={{
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                maxWidth: "400px",
                                                cursor: "pointer",
                                            }}
                                            title={discount.description}
                                        >
                                            {discount.description || "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="Update">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => handleUpdate(discount.discount_id)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Delete">
                                                <IconButton
                                                    sx={{ color: 'red' }}
                                                    onClick={() => handleDelete(discount.discount_id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <Modal open={open} onClose={handleModalClose}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "white",
                            padding: 3,
                            borderRadius: 1,
                            boxShadow: 24,
                            width: 500,
                        }}
                    >
                        <Typography variant="h6" gutterBottom sx={{ color: "black", textAlign: "center" }}>
                            Update Discount
                        </Typography>
                        <TextField
                            fullWidth
                            label="Discount Percentage"
                            type="number"
                            value={updatedDiscount.discount_percentage}
                            onChange={(e) =>
                                setUpdatedDiscount({
                                    ...updatedDiscount,
                                    discount_percentage: e.target.value,
                                })
                            }
                            margin="normal"
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <DatePicker
                                    label="Start Date"
                                    value={updatedDiscount.start_date}
                                    onChange={(newValue) =>
                                        setUpdatedDiscount({
                                            ...updatedDiscount,
                                            start_date: newValue,
                                        })
                                    }
                                    renderInput={(params) => <TextField {...params} />}
                                    margin="normal"
                                    inputFormat="YYYY-MM-DD"
                                />
                                <DatePicker
                                    label="End Date"
                                    value={updatedDiscount.end_date}
                                    onChange={(newValue) =>
                                        setUpdatedDiscount({
                                            ...updatedDiscount,
                                            end_date: newValue,
                                        })
                                    }
                                    renderInput={(params) => <TextField {...params} />}
                                    margin="normal"
                                    inputFormat="YYYY-MM-DD"
                                />
                            </div>
                        </LocalizationProvider>
                        <TextField
                            fullWidth
                            label="Description"
                            value={updatedDiscount.description}
                            onChange={(e) =>
                                setUpdatedDiscount({
                                    ...updatedDiscount,
                                    description: e.target.value,
                                })
                            }
                            margin="normal"
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleSubmitUpdate}
                            style={{ marginTop: 16 }}
                        >
                            Submit Update
                        </Button>
                    </Box>
                </Modal>
                <Modal open={createOpen} onClose={() => setCreateOpen(false)}>
                    <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "white", padding: 3, borderRadius: 1, boxShadow: 24, width: 500 }}>
                        <Typography variant="h6" gutterBottom textAlign="center" sx={{ color: "black" }}>Create Discount</Typography>
                        <TextField fullWidth label="Discount Percentage" type="number" value={newDiscount.discount_percentage} onChange={(e) => setNewDiscount({ ...newDiscount, discount_percentage: e.target.value })} margin="normal" />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box display="flex" gap={2}>
                                <DatePicker label="Start Date" value={newDiscount.start_date} onChange={(newValue) => setNewDiscount({ ...newDiscount, start_date: newValue })} />
                                <DatePicker label="End Date" value={newDiscount.end_date} onChange={(newValue) => setNewDiscount({ ...newDiscount, end_date: newValue })} />
                            </Box>
                        </LocalizationProvider>
                        <TextField fullWidth label="Description" value={newDiscount.description} onChange={(e) => setNewDiscount({ ...newDiscount, description: e.target.value })} margin="normal" />
                        <Button fullWidth variant="contained" color="primary" onClick={handleCreate} sx={{ mt: 2 }}>Create</Button>
                    </Box>
                </Modal>

                <Dialog
                    open={confirmDialogOpen}
                    onClose={() => setConfirmDialogOpen(false)}
                >
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this discount? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={confirmDelete} color="error" variant="contained">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={4000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                    <Alert
                        onClose={handleSnackbarClose}
                        severity={snackbarSeverity}
                        sx={{ width: "100%" }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Container>
        </div>
    );
};

export default DiscountList;
