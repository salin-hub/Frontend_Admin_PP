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
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

const DiscountList = () => {
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [currentDiscount, setCurrentDiscount] = useState(null);
    const [updatedDiscount, setUpdatedDiscount] = useState({
        discount_percentage: "",
        start_date: null,
        end_date: null,
        description: "",
    });

    useEffect(() => {
        fetchDiscounts();
    }, []);

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
        axios_api
            .delete(`/deleteDiscount/${id}`)
            .then(() => {
                setDiscounts(discounts.filter((discount) => discount.id !== id));
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    const handleUpdate = (id) => {
        const discountToUpdate = discounts.find((discount) => discount.id === id);
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
        // Ensure that all fields are filled before submitting
        if (
            updatedDiscount.discount_percentage === "" ||
            !updatedDiscount.start_date ||
            !updatedDiscount.end_date
        ) {
            setError("Please fill all fields.");
            return;
        }

        // Format dates before submitting
        const formattedDiscount = {
            ...updatedDiscount,
            start_date: updatedDiscount.start_date.format("YYYY-MM-DD"),
            end_date: updatedDiscount.end_date.format("YYYY-MM-DD"),
        };

        axios_api
            .put(`/updateDiscount/${currentDiscount.id}`, formattedDiscount)
            .then((response) => {
                setDiscounts(
                    discounts.map((discount) =>
                        discount.id === currentDiscount.id ? response.data : discount
                    )
                );
                setOpen(false);
                setCurrentDiscount(null);
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    return (
        <div style={{"width":"100%","display":"flex","alignItems":"center","justifyContent":"center"}}>
        <Container >
            <Typography variant="h4" gutterBottom >
                <div className="nameCreate"></div>
                Discount List
            </Typography>
            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}
            {!loading && !error && (
                <TableContainer component={Paper} sx={{paddingRight:"20px"}} fullWidth>
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
                                    <TableCell sx={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "400px",
                                        cursor: "pointer",
                                    }}
                                    title={discount.description}>{discount.description || "N/A"}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            style={{ marginRight: 8 }}
                                            onClick={() => handleUpdate(discount.id)}
                                        >
                                            Update
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleDelete(discount.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Modal for Update */}
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
                    <Typography variant="h6" gutterBottom sx={{color:"black","textAlign":"center"}}>
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
                        <div style={{ "display": "flex", "gap": "10px" }}>
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
        </Container>
        </div>
    );
};

export default DiscountList;
