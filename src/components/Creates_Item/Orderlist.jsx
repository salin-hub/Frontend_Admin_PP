import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
} from '@mui/material';
import axios_api from '../../API/axios';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectMessage, setRejectMessage] = useState('');
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios_api.get('/orders');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const title = order.items[0]?.book?.title?.toLowerCase() || '';
    const username = order.user?.name?.toLowerCase() || '';
    const author = order.items[0]?.book?.author?.name?.toLowerCase() || ''; // Assuming the author's name is inside 'author.name'
    const query = searchQuery.toLowerCase();
    return title.includes(query) || username.includes(query) || author.includes(query);
  });



  const approveOrder = async (orderItemId) => {
    try {
      await axios_api.put(`/order-items/${orderItemId}/status`, {
        status: 'approved',
      });
      fetchOrders(); // Refresh orders after update
    } catch (error) {
      console.error('Error approving the order item:', error);
    }
  };

  const rejectOrder = async () => {
    if (!rejectMessage) {
      alert('Please provide a rejection message');
      return;
    }

    try {
      await axios_api.put(`/order-items/${selectedOrderId}/status`, {
        status: 'rejected',
        message: rejectMessage, // Send rejection reason
      });
      fetchOrders(); // Refresh orders after rejection
      setOpenRejectDialog(false); // Close dialog
      setRejectMessage(''); // Clear rejection message
    } catch (error) {
      console.error('Error rejecting the order item:', error);
    }
  };

  const handleOpenRejectDialog = (orderItemId) => {
    setSelectedOrderId(orderItemId); // Store the order item ID to reject
    setOpenRejectDialog(true); // Open the dialog
  };

  const handleCloseRejectDialog = () => {
    setOpenRejectDialog(false); // Close the dialog without rejecting
    setRejectMessage(''); // Clear the message
  };

  return (
    <div style={{ padding: '20px' }}>
      <TextField
        variant="outlined"
        placeholder="Search order title"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: '20px' }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align='center'>No</TableCell>
              <TableCell align='center'>UserName</TableCell>
              <TableCell align='center'>Book Image</TableCell>
              <TableCell align='center'>Order Title</TableCell>
              <TableCell align='center'>Author Name</TableCell>
              <TableCell align='center'>Order Type</TableCell>
              <TableCell align='center'>Order Date</TableCell>
              <TableCell align='center'>Qty</TableCell>
              <TableCell align='center'>Price</TableCell>
              <TableCell align='center'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order, index) => (
              order.items.map((item, itemIndex) => (
                <TableRow key={`${index}-${itemIndex}`}>
                  <TableCell align='center'>{item.id}</TableCell>
                  <TableCell align='center'>{order.username}</TableCell>
                  <TableCell align='center'>
                    <img
                      src={
                        item.book.cover_path

                      }
                      alt={item.book.title}
                      style={{ width: '50px', height: '75px' }}
                    />
                  </TableCell>
                  <TableCell align='center'>{item.book?.title || 'No title available'}</TableCell>
                  <TableCell align='center'>{item.book?.author?.name || 'No Author'}</TableCell>
                  <TableCell align='center'>{item.book?.type || 'No Type'}</TableCell>
                  <TableCell align='center'>{new Date(order.created_at).toLocaleDateString('en-GB') || 'No Date'}</TableCell>
                  <TableCell align='center'>{item.quantity || 'N/A'}</TableCell>
                  <TableCell align='center'>${item.price || 'N/A'}</TableCell>
                  <TableCell align='center'>
                    <Stack spacing={2} direction="row">
                      <Button
                        variant="contained"
                        onClick={() => approveOrder(item.id)}
                        disabled={item.status !== 'pending'}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handleOpenRejectDialog(item.id)}
                        disabled={item.status !== 'pending'}
                        color="error"
                      >
                        Reject
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for rejecting the order */}
      <Dialog open={openRejectDialog} onClose={handleCloseRejectDialog} fullWidth>
        <DialogTitle>Reject Order</DialogTitle>
        <DialogContent>
          <TextField
            label="Rejection Message"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={rejectMessage}
            onChange={(e) => setRejectMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={rejectOrder} color="error">
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OrderList;
