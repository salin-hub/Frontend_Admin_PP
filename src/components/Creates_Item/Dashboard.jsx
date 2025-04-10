import { Paper, Grid, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LinearProgress } from '@mui/material';
import axios from '../../API/axios'; // Adjust the import according to your file structure
const Dashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [booksCount, setBooksCount] = useState(0);
  const [authorsCount, setAuthorsCount] = useState(0);
  const [ordercount,setOrdercount]=useState(0);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [usersResponse, booksResponse, authorsResponse, orderResponse] = await Promise.all([
          axios.get('/accounts'),
          axios.get('/getbooks'), 
          axios.get('/getauthors'),
          axios.get('/orders')
        ]);

        // Set state based on the responses
        setUsersCount(usersResponse.data.users.length); 
        setBooksCount(booksResponse.data.books.length);
        setAuthorsCount(authorsResponse.data.authors.length);
        setOrdercount(orderResponse.data.orders.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <> <div className="nameCreate" >
      <h1>Dashboard</h1>
    </div>
      {loading && <LinearProgress sx={{ marginBottom: '20px' }} />}
      <div style={{ padding: '20px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Paper style={{ padding: '20px', textAlign: 'center', cursor:"pointer"}} onClick={()=>navigate("/book")}>
              <Typography variant="h6">Total Books</Typography>
              <Typography variant="h4">{booksCount}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper style={{ padding: '20px', textAlign: 'center', cursor:"pointer"}} onClick={()=>navigate("/Authors")}>
              <Typography variant="h6">Total Authors</Typography>
              <Typography variant="h4">{authorsCount}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper style={{ padding: '20px', textAlign: 'center', cursor:"pointer"}} onClick={()=>navigate("/orderlist")}>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h4">{ordercount}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
           
              <Paper style={{ padding: '20px', textAlign: 'center', cursor: "pointer"}} onClick={()=>navigate('/usertable')}>
                <Typography variant="h6">Total Users</Typography>
                <Typography variant="h4">{usersCount}</Typography>
              </Paper>
   
          </Grid>
        </Grid>
      </div></>
  );
};

export default Dashboard;