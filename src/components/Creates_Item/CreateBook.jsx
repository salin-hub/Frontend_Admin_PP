import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
  Typography,
} from "@mui/material";
import { Backdrop, CircularProgress } from '@mui/material';
import axios from "../../API/axios";
const BookForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author_id: "",
    category_id: "",
    publisher: "",
    publish_date: "",
    pages: "",
    dimensions: "",
    language: "",
    ean: "",
    type: "handbook",
    cover_file: null,
    price_handbook: "",
    quantity: "",
  });

  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    // // Make sure 'author_ids' is always an array
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Fetch subcategories if the category changes
    if (name === "category_id") {
      try {
        const subcategoryResponse = await axios.get(`/${value}/subcategories`);
        setSubcategories(subcategoryResponse.data.subcategories || []);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setSubcategories([]);
      }
    }
  };




  useEffect(() => {
    const fetchCategoriesAndAuthors = async () => {
      try {
        const categoryResponse = await axios.get("categories");
        const authorResponse = await axios.get("getauthors");
        setCategories(categoryResponse.data.categories || []);
        setAuthors(authorResponse.data.authors);
      } catch (err) {
        console.error("Error fetching categories and authors", err);
      }
    };

    fetchCategoriesAndAuthors();
  }, []);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     [name]: value,
  //   }));
  // };

  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      cover_file: e.target.files[0],
      if(file) {
        setFilePreview(URL.createObjectURL(file));
      }
    }));

  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({}); // Reset errors
    console.log("Selected cover file:", formData.cover_file);

    if (!formData.cover_file) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        cover_file: ["Cover image is required"],
      }));
      setIsLoading(false);
      return; // Stop form submission if no file is selected
    }

    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        formDataToSubmit.append(key, formData[key]);
      }
    });

    // Ensure the file is added with the correct key
    if (formData.cover_file) {
      formDataToSubmit.append("cover_path", formData.cover_file);
    }

    try {
      await axios.post("/books", formDataToSubmit, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure this matches backend requirements
        },
      });
      setSuccessMessage("Book created successfully!");
      setFormData({
        title: "",
        description: "",
        author_id: "",
        category_id: "",
        publisher: "",
        publish_date: "",
        pages: "",
        dimensions: "",
        language: "",
        ean: "",
        type: "handbook",
        cover_file: null,
        price_handbook: "",
        quantity:"",
      });
    } catch (err) {
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors); // Show backend validation errors
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="Control_deshboard">
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="nameCreate">
        <h1>Create Book</h1>
      </div>
      <Box sx={{ mx: "auto", my: 4, padding: 2, border: "1px solid #ddd", borderRadius: "8px" }}>
        {successMessage && <Typography color="green" gutterBottom>{successMessage}</Typography>}

        <form onSubmit={handleSubmit}>
          <Grid container style={{ display: "flex", "justifyContent": "center", gap: "20px" }}>
            <div style={{ width: "40%", display: "flex", flexDirection: "column", gap: "15px" }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={!!errors.title}
                  helperText={errors.title && errors.title.join(", ")}
                />
              </Grid>
              <Grid item xs={12}>
                <label htmlFor="description" style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: '#666' }}>
                  Description
                </label>
                <textarea

                  id="description"
                  name="description"

                  value={formData.description}
                  onChange={handleChange}
                  style={{
                    padding: "0",
                    width: "100%",
                    height: '200px',
                    fontSize: '1rem',
                    borderColor: errors.description ? 'red' : '#ccc',
                    borderRadius: '4px',
                    resize: 'vertical',
                    background: "none",
                    color: "black"
                  }}
                />
                {errors.description && (
                  <div style={{ color: 'red', fontSize: '0.75rem', marginTop: '4px' }}>
                    {errors.description.join(', ')}
                  </div>
                )}
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.author_id}>
                  <InputLabel>Author</InputLabel>
                  <Select
                    label="Author"
                    name="author_id"
                    value={formData.author_id}
                    onChange={handleChange}
                  >
                    {authors.map((author) => (
                      <MenuItem key={author.id} value={author.id}>
                        {author.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.author_id && <FormHelperText>{errors.author_id.join(", ")}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.category_id}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    label="Category"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category_id && <FormHelperText>{errors.category_id.join(", ")}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.subcategory_id} disabled={!subcategories.length}>
                  <InputLabel>SubCategory</InputLabel>
                  <Select
                    label="SubCategory"
                    name="subcategory_id"
                    value={formData.subcategory_id || ""}
                    onChange={handleChange}
                  >
                    {subcategories.map((subcategory) => (
                      <MenuItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.subcategory_id && <FormHelperText>{errors.subcategory_id.join(", ")}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Publisher"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  error={!!errors.publisher}
                  helperText={errors.publisher && errors.publisher.join(", ")}
                />
              </Grid>
            </div>
            <div style={{ width: "50%", display: "flex", flexDirection: "column" }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Publish Date"
                  name="publish_date"
                  type="date"
                  value={formData.publish_date}
                  onChange={handleChange}
                  error={!!errors.publish_date}
                  helperText={errors.publish_date && errors.publish_date.join(", ")}
                  InputLabelProps={{
                    shrink: true,
                  }}

                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Pages"
                  name="pages"
                  type="number"
                  value={formData.pages}
                  onChange={handleChange}
                  error={!!errors.pages}
                  helperText={errors.pages && errors.pages.join(", ")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Dimensions"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleChange}
                  error={!!errors.dimensions}
                  helperText={errors.dimensions && errors.dimensions.join(", ")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  error={!!errors.language}
                  helperText={errors.language && errors.language.join(", ")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="EAN"
                  name="ean"
                  value={formData.ean}
                  onChange={handleChange}
                  error={!!errors.ean}
                  helperText={errors.ean && errors.ean.join(", ")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price_handbook"
                  type="number"
                  value={formData.price_handbook}
                  onChange={handleChange}
                  error={!!errors.price_handbook}
                  helperText={errors.price_handbook && errors.price_handbook.join(", ")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Stock"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  error={!!errors.quantity}
                  helperText={errors.quantity && errors.quantity.join(", ")}
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  type="file"
                  name="cover_path"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                  style={{
                    padding: '10px',
                    fontSize: '16px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    backgroundColor: '#f9f9f9',
                    display: 'block',
                    marginBottom: '10px',
                  }}
                />
                {errors.cover_path && (
                  <Typography color="red" sx={{ marginTop: '5px', fontSize: '14px' }}>
                    {errors.cover_path}
                  </Typography>
                )}
                {filePreview && (
                  <div style={{ marginTop: '15px' }}>
                    <img
                      src={filePreview}
                      alt="Cover Preview"
                      style={{
                        width: '150px',
                        height: 'auto',
                        borderRadius: '5px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Typography sx={{ marginTop: '5px', fontSize: '14px', textAlign: 'center' }}>
                      Image Preview
                    </Typography>
                  </div>
                )}
              </Grid>
            </div>
            <Grid item xs={12} display={"flex"} justifyContent={"center"}>
              <Button variant="contained" color="primary" type="submit" style={{width:"200px"}} >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box></div>
  );
};

export default BookForm;
