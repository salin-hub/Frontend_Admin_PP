import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChecklistIcon from '@mui/icons-material/Checklist';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import LogoutIcon from '@mui/icons-material/Logout';
import SpeedIcon from '@mui/icons-material/Speed';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Account Icon
import axios from '../../API/loginAPi';

const SideBar = () => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState({});

  const handleLogout = async () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      alert('No user token found!');
      return;
    }
  
    try {
      const response = await axios.post('/logout', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // If successful logout, clear localStorage and redirect
      localStorage.removeItem('authToken');
      localStorage.removeItem('Role');
      localStorage.removeItem('Admin_id');
      
      // const navigate = useNavigate();
      navigate('/login'); // Or navigate('/') to homepage
    } catch (error) {
      // Handle token expiration or other errors
      if (error.response && error.response.status === 401) {
        alert('Your session has expired. Please log in again.');
      } else {
        alert('Logout failed. Please try again.');
      }
      console.error(error);
    }
  };
  
  

  const toggleDropdown = (key) => {
    setOpenDropdown((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <SpeedIcon /> },
    {
      label: 'Books',
      icon: <MenuBookRoundedIcon />, 
      children: [
        { path: '/book', label: 'Book List' },
      ]
    },
    {
      label: 'Category List',
      icon: <CategoryIcon />,
      children: [
        { path: '/categories', label: 'Categories' },
        { path: '/subcategory_list', label: 'Subcategories' }
      ]
    },
    { path: '/authors', label: 'Author', icon: <PeopleAltIcon /> },
    { path: '/create', label: 'Create', icon: <AddCircleOutlineIcon /> },
    { path: '/manage/discount', label: 'Disounts ', icon: <ChecklistIcon />,
      children: [
        { path: '/couponlist', label: 'Coupon List' },
        { path: '/discount_list', label: 'Discounts List' },
      ]
    },
    { path: '/orderlist', label: 'Order List', icon: <ChecklistIcon /> },
    {
      label: 'Account',
      icon: <AccountCircleIcon />,
      children: [
        { path: '/profile', label: 'Profile' },
        { path: '/setting', label: 'Settings' },
      ]
    },
  ];

  return (
    <div className="controll_Sidebar">
      <List component="nav">
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.children ? (
              <>
                <ListItemButton onClick={() => toggleDropdown(index)} sx={{ borderRadius: 3 }}>
                  <ListItemIcon sx={{ minWidth: 'auto', marginRight: '10px' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} sx={{ color: 'black' }} primaryTypographyProps={{ fontSize: 14, fontWeight: 'bold' }} />
                  {openDropdown[index] ? <ExpandLess sx={{color:"black"}} /> : <ExpandMore sx={{color:"black"}} />}
                </ListItemButton>
                <Collapse in={openDropdown[index]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((subItem, subIndex) => (
                      <ListItemButton key={subIndex} component={Link} to={subItem.path} sx={{ pl: 4 }}>
                        <ListItemText primary={subItem.label} primaryTypographyProps={{ fontSize: 13 }} sx={{ color: 'black' }} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItemButton component={Link} to={item.path} sx={{ borderRadius: 3 }}>
                <ListItemIcon sx={{ minWidth: 'auto', marginRight: '10px' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} sx={{ color: 'black' }} primaryTypographyProps={{ fontSize: 14, fontWeight: 'bold' }} />
              </ListItemButton>
            )}
          </div>
        ))}
      </List>
      <div className="logout">
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon sx={{ minWidth: 'auto', marginRight: '10px' }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" sx={{ color: 'black' }} primaryTypographyProps={{ fontSize: 14, fontWeight: 'bold' }} />
        </ListItemButton>
      </div>
    </div>
  );
};

export default SideBar;
