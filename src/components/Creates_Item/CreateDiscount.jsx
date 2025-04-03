import { useState } from "react";
import { Container, TextField, Button, Alert, Typography, Box } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios_api from "../../API/axios";

export default function CreateDiscount() {
  const [formData, setFormData] = useState({
    discount_percentage: "",
    start_date: dayjs(),
    end_date: dayjs().add(1, "month"),
    description: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Handle text field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle date picker changes
  const handleDateChange = (name, date) => {
    setFormData({ ...formData, [name]: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError("");
  
    const formattedData = {
      discount_percentage: Number(formData.discount_percentage), // Ensure it's a number
      start_date: formData.start_date.format("YYYY-MM-DD"),
      end_date: formData.end_date.format("YYYY-MM-DD"),
      description: formData.description,
    };
  
    console.log("Sending Data:", formattedData); // Debug log
  
    try {
      await axios_api.post("/createDiscount", formattedData);
      setSuccess(true); // Show success message
  
      // Reset form fields
      setFormData({
        discount_percentage: "",
        start_date: dayjs(),
        end_date: dayjs().add(1, "month"),
        description: "",
      });
    } catch (error) {
      console.error("Axios Error:", error);
      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        console.error("Error Status:", error.response.status);
      }
      setError("An error occurred while creating the discount.");
    }
  };
  
  {success && <Alert severity="success">Discount created successfully!</Alert>}

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="sm">
        <Box sx={{ mt: 5, p: 2, bgcolor: "white", boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
            Create Discount
          </Typography>

          {success && <Alert severity="success">Discount created successfully!</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Discount Percentage"
              type="number"
              name="discount_percentage"
              value={formData.discount_percentage}
              onChange={handleChange}
              margin="normal"
              required
            />

            <DatePicker
              label="Start Date"
              value={formData.start_date}
              onChange={(date) => handleDateChange("start_date", date)}
              slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
            />
            <DatePicker
              label="End Date"
              value={formData.end_date}
              onChange={(date) => handleDateChange("end_date", date)}
              slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
              required
            />

            <Button fullWidth type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Create Discount
            </Button>
          </form>
        </Box>
      </Container>
    </LocalizationProvider>
  );
}
