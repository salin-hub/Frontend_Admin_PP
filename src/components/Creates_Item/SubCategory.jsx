import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,

  styled,
  Typography
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "../../API/axios";

styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const SubCategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/allsubcategory")
      .then((response) => {
        setCategories(response.data.subcategories);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="nameCreate" style={{ marginBottom: 20 }}>
        <Typography variant="h6" gutterBottom sx={{ fontFamily: 'system-ui', color: 'black' }}>Category List</Typography>
      </div>

      <TableContainer component={Paper} sx={{
        maxHeight: '80vh',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}>
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : categories.length > 0 ? (
              categories.map((category, index) => (
                <TableRow key={category.id}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">
                    <TableCell align="center">
                      <strong>{category.name}</strong>
                    </TableCell>
                  </TableCell>
                  <TableCell align="center">
                    <strong>{category.category.name}</strong>
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SubCategoryTable;
