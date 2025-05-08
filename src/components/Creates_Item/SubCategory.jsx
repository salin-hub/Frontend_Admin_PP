import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box, Stack, styled } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "../../API/axios";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

const SubCategoryTable = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("/subcategories")
      .then((response) => {
        console.log(response.data.categories); // Log data for debugging
        setCategories(response.data.categories);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <>
      <div className="nameCreate">
        <h1>Category List</h1>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">No</TableCell>
              <TableCell align="center">Subcategory Name</TableCell>
              <TableCell align="center">Category Name</TableCell>
              <TableCell align="center">Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category, index) => (
              <TableRow key={category.id}>
                <TableCell align="center">{index + 1}</TableCell>
              
                <TableCell align="center">
                  {category.sub_categories && Array.isArray(category.sub_categories) && category.sub_categories.length > 0 ? (
                    category.sub_categories.map((sub) => (
                      <Box key={sub.id} sx={{ width: "100%" }}>
                        <Stack
                          sx={{
                            padding: '0px',
                            '&:hover': {
                              padding: '1px',
                              transition: 'padding 0.3s ease',
                            },
                            transition: 'padding 0.3s ease',
                          }}
                        >
                          <Item sx={{ marginBottom: 1 }}>{sub.name}</Item>
                        </Stack>
                      </Box>
                    ))
                  ) : (
                    <p>No subcategories available</p> // Fallback if no subcategories
                  )}
                </TableCell>
                <TableCell align="center">
                  <strong>{category.name}</strong>
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SubCategoryTable;
