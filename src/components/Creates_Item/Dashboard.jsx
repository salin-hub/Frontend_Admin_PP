import { Paper, Grid, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LinearProgress } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend, LineChart,
  Line,
} from 'recharts';

import axios from '../../API/axios'; // Adjust the import according to your file structure
const Dashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [booksCount, setBooksCount] = useState(0);
  const [authorsCount, setAuthorsCount] = useState(0);
  const [ordercount, setOrdercount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [categoryCount, setCategoryCount] = useState([]);
  const [orderStats, setOrderStats] = useState([]);
  const [booksStats, setBooksStats] = useState([]);



  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [usersResponse, booksResponse, authorsResponse, orderResponse, categoriesResponse] = await Promise.all([
          axios.get('/accounts'),
          axios.get('/getbooks'),
          axios.get('/getauthors'),
          axios.get('/orders'),
          axios.get('/categories')
        ]);
        const books = booksResponse.data.books;
        const authors = authorsResponse.data.authors;

        const authorData = authors.map(author => {
          const count = books.filter(book => book.author_id === author.id).length;
          return {
            name: author.name,
            count
          };
        });

        setBooksStats(authorData);


        const orders = orderResponse.data.orders;

        const orderDataByMonth = {};
        const orderDataByDay = {};

        orders.forEach(order => {
          const date = new Date(order.created_at);
          const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          const day = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

          // Count by month
          if (orderDataByMonth[month]) {
            orderDataByMonth[month] += 1;
          } else {
            orderDataByMonth[month] = 1;
          }

          // Count by day
          if (orderDataByDay[day]) {
            orderDataByDay[day] += 1;
          } else {
            orderDataByDay[day] = 1;
          }
        });
        const orderStatsByMonth = Object.keys(orderDataByMonth).map(month => ({
          month,
          count: orderDataByMonth[month]
        }));
        const orderStatsByDay = Object.keys(orderDataByDay).map(day => ({
          day,
          count: orderDataByDay[day]
        }));

        setOrderStats({
          byMonth: orderStatsByMonth,
          byDay: orderStatsByDay
        });


        setUsersCount(usersResponse.data.users.length);
        setBooksCount(booksResponse.data.books.length);
        setAuthorsCount(authorsResponse.data.authors.length);
        setOrdercount(orderResponse.data.orders.length);

        const categories = categoriesResponse.data.categories;

        const categoryData = categories.map(category => {
          const count = books.filter(book => book.category_id === category.id).length;
          return {
            name: category.name,
            count
          };
        });

        setCategoryCount(categoryData);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };


    fetchCounts();
  }, []);


  return (
    <div className='Control_deshboard'>
      <div className="nameCreate" >
        <h1>Dashboard</h1>
      </div>
      {loading && <LinearProgress sx={{ marginBottom: '20px' }} />}
      <div style={{ padding: '20px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Paper style={{ padding: '20px', textAlign: 'center', cursor: "pointer" }} onClick={() => navigate("/book")}>
              <Typography variant="h6">Total Books</Typography>
              <Typography variant="h4">{booksCount}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper style={{ padding: '20px', textAlign: 'center', cursor: "pointer" }} onClick={() => navigate("/Authors")}>
              <Typography variant="h6">Total Authors</Typography>
              <Typography variant="h4">{authorsCount}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper style={{ padding: '20px', textAlign: 'center', cursor: "pointer" }} onClick={() => navigate("/orderlist")}>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h4">{ordercount}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>

            <Paper style={{ padding: '20px', textAlign: 'center', cursor: "pointer" }} onClick={() => navigate('/usertable')}>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">{usersCount}</Typography>
            </Paper>

          </Grid>
        </Grid>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", padding: "10px" }}>
        <div style={{ width: "50%", height: 400 }}>
          <h2 style={{ textAlign: 'center', color: "black", fontSize: "14px" }}>Books per Category</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryCount} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ width: '50%', height: 400 }}>
          <h2 style={{ textAlign: 'center', color: 'black', fontSize: "14px" }}>
            Orders Per Day 
          </h2>
          <div style={{ width: '100%', height: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={orderStats.byDay}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#82ca9d"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ width: '100%', height: 400, paddingTop: "50px" }}>
          <h2 style={{ textAlign: 'center', color: 'black', fontSize: '14px' }}>Books per Author</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={booksStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>


      </div>



    </div>
  );
};

export default Dashboard;