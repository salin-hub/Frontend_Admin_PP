import { useState, useEffect } from 'react';
import logo from '../src/assets/imgs/mainlogo.png';
import status from '../src/assets/imgs/boy.png';
import axios from './API/loginAPi'; // Ensure this file exports a configured Axios instance

const Header = () => {
    const [userData, setUserData] = useState({ name: '', role: '' });
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/account');

                // setUserData({ 
                //     name: response.data.user.name, 
                //     role: response.data.user.role });

                if (response.data && response.data.user) {
                    setUserData({
                        name: response.data.user.name,
                        role: response.data.user.role,
                    });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className="Navbar_controll">
            <div className="logo_admin">
                <img src={logo} alt="main logo" />
            </div>
            <div className="controll_profile">
                <div className="status">
                    <img src={status} alt="status icon" />
                </div>
                <div className="Name">
                    <h1>{userData.name || 'Loading...'}</h1>
                    <p>{userData.role || 'Loading...'}</p>
                </div>
            </div>
        </div>
    );
};

export default Header;
