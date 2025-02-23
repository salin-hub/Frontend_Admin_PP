import { useLocation, Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ChecklistIcon from '@mui/icons-material/Checklist';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import LogoutIcon from '@mui/icons-material/Logout';
import SpeedIcon from '@mui/icons-material/Speed';
import axios from '../../API/loginAPi';
import { useNavigate } from 'react-router-dom';
const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = async () => {
    try {
      // Call the logout API
      await axios.post('/logout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      // Clear authentication-related data
      localStorage.removeItem('authToken');
      localStorage.removeItem('Admin_id');
      localStorage.removeItem('Role');

      // Redirect to the login page
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to log out. Please try again.');
    }
  }
 

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <SpeedIcon /> },
    { path: '/book', label: 'Books', icon: <MenuBookRoundedIcon /> },
    { path: '/categorylist', label: 'Category List', icon: <CategoryIcon /> },
    { path: '/authors', label: 'Author', icon: <PeopleAltIcon /> },
    { path: '/create', label: 'Create', icon: <AddCircleOutlineIcon /> },
    { path: '/orderlist', label: 'Order List', icon: <ChecklistIcon /> },
  ];

  return (
    <div className="controll_Sidebar">
      <List component="nav" aria-labelledby="nested-list-subheader">
        {menuItems.map((item, index) => (
          <ListItemButton
            key={index}
            component={Link}
            to={item.path}
            sx={{
              borderRadius: 3,
              bgcolor: 'primary.main',
              background: location.pathname === item.path ? '#11669c' : 'transparent',
              ':hover': {
                background: location.pathname === item.path ? '#11669c' : 'transparent',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', marginRight: '10px' }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              sx={{
                color: location.pathname === item.path ? 'white' : 'black',
              }}
              primaryTypographyProps={{ fontSize: 14, fontWeight: 'bold' }}
            />
          </ListItemButton>
        ))}
      </List>
      <div className="logout">
        <ListItemButton
          sx={{
            ':hover': {
              background: 'transparent',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 'auto', marginRight: '10px' }}><LogoutIcon /></ListItemIcon>
          <ListItemText
          onClick={ handleLogout}
            primary="Logout"
            sx={{ color: 'black' }}
            primaryTypographyProps={{ fontSize: 14, fontWeight: 'bold' }}
          />
        </ListItemButton>
      </div>
    </div>
  );
};

export default SideBar;
