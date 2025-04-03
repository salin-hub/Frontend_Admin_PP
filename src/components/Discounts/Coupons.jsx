import { useState } from "react";
import { TextField, Button, Container, Typography} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "../../API/loginAPi";

const CreateCoupon = () => {
  const [coupon, setCoupon] = useState({
    coupon_code: "",
    discount_percentage: "",
    start_date: dayjs(),
    end_date: dayjs().add(1, "month"),
    usage_limit: "",
    minimum_order_value: "",
    description: "",
  });

  const handleChange = (e) => {
    setCoupon({ ...coupon, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name, date) => {
    setCoupon({ ...coupon, [name]: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedCoupon = {
      ...coupon,
      start_date: coupon.start_date.format('YYYY-MM-DD'),
      end_date: coupon.end_date.format('YYYY-MM-DD'),
    };
    try {
      await axios.post("/addcoupong", formattedCoupon);
      alert("Coupon created successfully!");
      setCoupon({
        coupon_code: "",
        discount_percentage: "",
        start_date: dayjs(),
        end_date: dayjs().add(1, "month"),
        usage_limit: "",
        minimum_order_value: "",
        description: "",
      });
    } catch (error) {
      console.error("Error creating coupon:", error);
    }
  };
  

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Coupon
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Coupon Code" name="coupon_code" value={coupon.coupon_code} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Discount Percentage" name="discount_percentage" type="number" value={coupon.discount_percentage} onChange={handleChange} margin="normal" required />
          <DatePicker
            label="Start Date"
            value={coupon.start_date}
            onChange={(date) => handleDateChange("start_date", date)}
            renderInput={(params) => <TextField fullWidth margin="normal" {...params} />}
          />
          <DatePicker
            label="End Date"
            value={coupon.end_date}
            onChange={(date) => handleDateChange("end_date", date)}
            renderInput={(params) => <TextField fullWidth margin="normal" {...params} />}
          />
          <TextField fullWidth label="Usage Limit" name="usage_limit" type="number" value={coupon.usage_limit} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Minimum Order Value" name="minimum_order_value" type="number" value={coupon.minimum_order_value} onChange={handleChange} margin="normal" required />
          <TextField fullWidth label="Description" name="description" value={coupon.description} onChange={handleChange} margin="normal" />
          <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
            Create Coupon
          </Button>
        </form>
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Existing Coupons
        </Typography>
        
      </Container>
    </LocalizationProvider>
  );
};

export default CreateCoupon;
