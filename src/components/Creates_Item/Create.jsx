import { Link } from 'react-router-dom';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import  FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
const Create = () => {
  const items = [
    { path: '/createBook', label: 'Books', icon: <AutoStoriesIcon /> },
    { path: '/CreateAuthor', label: 'Authors', icon: <PeopleAltIcon /> },
    { path: '/CreateCategory', label: 'Categories', icon: <FeaturedPlayListIcon /> },
    { path: '/subcategory', label: 'Sub Categories', icon: <AccountTreeIcon /> },
    { path: '/Banner', label: 'Banner', icon: <ViewCarouselIcon /> },
    { path: '/create_coupon', label: 'Coupon', icon: <ViewCarouselIcon /> },
    { path: '/create_discount', label: 'Discount', icon: <ViewCarouselIcon /> },
    { path: '/create_discount_Books', label: 'Discount Books', icon: <ViewCarouselIcon /> },
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
