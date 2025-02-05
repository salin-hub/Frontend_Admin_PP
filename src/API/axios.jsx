import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/admin', // Base URL for your API
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken'); // Retrieve token from local storage
  if (token) {
    console.log(token)
    config.headers['Authorization'] = `Bearer ${token}`; // Attach token to headers
  }
  return config;
});

export default instance;