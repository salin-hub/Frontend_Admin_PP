
import { useState, useEffect } from "react";
import axios from "../../API/axios";
import { TextField, Button, Container, Typography, Box, MenuItem, Alert } from "@mui/material";

const SubCategoryForm = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [subCategory, setSubCategory] = useState({ name: "" });
    const [message, setMessage] = useState({ text: "", type: "" });

    // Fetch all categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("/categories"); // Ensure this matches your API route
                setCategories(response.data.categories || []);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };

        fetchCategories();
    }, []);

    // Handle form input change
    const handleChange = (e) => {
        setSubCategory({ ...subCategory, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCategory) {
            setMessage({ text: "Please select a category.", type: "error" });
            return;
        }

        try {
            await axios.post(`/${selectedCategory}/subcategories`, subCategory);
            setMessage({ text: "SubCategory created successfully!", type: "success" });
            setSubCategory({ name: "" });
        } catch (error) {
            setMessage({ text: "Error creating subcategory.", type: "error" });
            console.error("Error:", error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Create SubCategory
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        select
                        label="Select Category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        margin="normal"
                        required
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        label="SubCategory Name"
                        name="name"
                        value={subCategory.name}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
                        Create SubCategory
                    </Button>
                </form>
                {message.text && (
                    <Alert severity={message.type} sx={{ mt: 2 }}>
                        {message.text}
                    </Alert>
                )}
            </Box>
        </Container>
    );
};

export default SubCategoryForm;