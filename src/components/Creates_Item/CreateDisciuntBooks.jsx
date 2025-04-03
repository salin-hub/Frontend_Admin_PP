import { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Alert,
  Typography,
  Box,
  MenuItem,
} from "@mui/material";
import axios_api from "../../API/axios";

export default function DiscountBook() {
  const [books, setBooks] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [formData, setFormData] = useState({ book_id: "", discount_id: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [booksRes, discountsRes] = await Promise.all([
        axios_api.get("/getbooks"),
        axios_api.get("/getDiscount"),
      ]);
      setBooks(booksRes.data.books);
      setDiscounts(discountsRes.data.discount_List);
    } catch (err) {
      console.log(err);
      setError("Error fetching data");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError("");

    try {
      await axios_api.post("/DiscountBook", formData);
      setSuccess(true);
      setFormData({ book_id: "", discount_id: "" }); // Reset fields
      fetchData(); // Refresh list
    } catch (err) {
      console.log(err);
      setError("Failed to apply discount");
    }
  };
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 2, bgcolor: "white", boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
          Apply Discount to Book
        </Typography>
        {success && <Alert severity="success">Discount applied successfully!</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            select
            label="Select Book"
            name="book_id"
            value={formData.book_id}
            onChange={handleChange}
            margin="normal"
            required
          >
            {books.map((book) => (
              <MenuItem key={book.id} value={book.id}>
                {book.title}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            select
            label="Select Discount"
            name="discount_id"
            value={formData.discount_id}
            onChange={handleChange}
            margin="normal"
            required
          >
            {discounts.map((discount) => (
              <MenuItem key={discount.id} value={discount.id}>
                {discount.description} - {discount.discount_percentage}%
              </MenuItem>
            ))}
          </TextField>

          <Button fullWidth type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Apply Discount
          </Button>
        </form>
      </Box>
    </Container>
  );
}
