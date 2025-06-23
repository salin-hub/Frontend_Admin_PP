import { useState, useEffect } from 'react';
// import logo from '../src/assets/imgs/mainlogo.png';
import status from '../src/assets/imgs/boy.png';
import axios from './API/loginAPi'; // Ensure this file exports a configured Axios instance

const Header = () => {
    const [userData, setUserData] = useState({ name: '', role: '' });
    const [currentTime, setCurrentTime] = useState(new Date());

    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/account');
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

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Get greeting message based on the current hour
    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    // const formattedTime = currentTime.toLocaleTimeString([], {
    //     hour: '2-digit',
    //     minute: '2-digit',
    //     second: '2-digit',
    // });

    return (
        <div className="Navbar_controll">
            <div className="logo_admin" style={{ width: "400px"}}>
                <h2 style={{fontSize:"20px"}}>{getGreeting()}, {userData.name || 'Loading...'}</h2>
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
