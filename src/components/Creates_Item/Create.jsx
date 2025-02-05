import { Link } from 'react-router-dom';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
const Create = () => {
  // Define the items array
  const items = [
    { path: '/createBook', label: 'Books', icon: <AutoStoriesIcon /> },
    { path: '/CreateAuthor', label: 'Authors', icon: <PeopleAltIcon /> },
    { path: '/CreateCategory', label: 'Categories', icon: <AutoStoriesIcon /> },
    { path: '/Banner', label: 'Banner', icon: <AutoStoriesIcon /> },
  ];

  return (
    <div className="control_create">
      <div className="nameCreate" >
        <h1>Create</h1>
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
