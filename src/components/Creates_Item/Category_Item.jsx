import { Link } from 'react-router-dom';
import  FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
const Create = () => {
  const items = [
    { path: '/Categories', label: 'Categories', icon: <FeaturedPlayListIcon /> },
    { path: '/subcategory', label: 'Sub Categories', icon: <AccountTreeIcon /> },
  ];

  return (
    <div className="control_create">
      <div className="nameCreate" >
        <h1>List All Category</h1>
      </div>
      <div className="item_create">
        {items.map((item, index) => (
          <Link to={item.path || '#'} key={index} className="item" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="icon" >{item.icon}</div>
            <p>{item.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Create;
