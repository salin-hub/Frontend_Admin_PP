import { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import './assets/Style/create.css';
import Dashboard from './components/Creates_Item/Dashboard';
import OrderList from './components/Creates_Item/Orderlist';
import Book from './components/Creates_Item/Books';
import CreateAuthorForm from './components/Creates_Item/CreateAuthors';
import CreateBook from './components/Creates_Item/CreateBook';
import SideBar from './components/Cotroller_full/SildeBar';
import Create from '../src/components/Creates_Item/Create';
import CreateCategoryForm from './components/Creates_Item/CreateCategory';
import LoginPage from './components/Accounts/login_acc';
import UserTable from './components/Accounts/UserController';
import Settings from './components/Setting/Setting';
import Authors from './components/Creates_Item/Authors';
import Categories from './components/Creates_Item/CategoryList';
import SubCategoryForm from './components/Creates_Item/CreateSubCategory';
import CategoryList from './components/Creates_Item/Category_Item';
import { BrowserRouter as Router, Routes, Route, Outlet, useNavigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <AppWithRouter />
    </Router>
  );
}

function AppWithRouter() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('Admin_id');
    if (!user) {
      setIsLoggedIn(false);
      navigate('/login');
    } else {
      setIsLoggedIn(true);
    }
  }, [navigate]);

  return (
    <Routes>
      {/* Login Route */}
      <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />

      {/* Protected Routes */}
      {isLoggedIn && (
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/Categories" element={<Categories />} />
          <Route path="/Authors" element={<Authors />} />
          <Route path="/create" element={<Create />} />
          <Route path="/createBook" element={<CreateBook />} />
          <Route path="/CreateAuthor" element={<CreateAuthorForm />} />
          <Route path="/CreateCategory" element={<CreateCategoryForm />} />
          <Route path="/book" element={<Book />} />
          <Route path="/orderlist" element={<OrderList />} />
          <Route path="/usertable" element={<UserTable />} />
          <Route path="/setting" element={<Settings />} />
          <Route path="/subcategory" element={<SubCategoryForm />} />
          <Route path="/categorylist" element={<CategoryList />} />
        </Route>
      )}

      {/* If not logged in, redirect to login */}
      {!isLoggedIn && <Route path="/" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />}
    </Routes>
  );
}

// Main layout when logged in
const MainLayout = () => {
  return (
    <div className="Header">
      <Header />
      <div className="controll_body">
        <div className="sidebar">
          <SideBar />
        </div>
        <div className="body_item">
          <Outlet /> {/* Child routes will render here */}
        </div>
      </div>
    </div>
  );
};

export default App;
