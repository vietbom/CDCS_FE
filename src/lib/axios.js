// import axios from "axios";

// export const axiosInstance = axios.create({
//     baseURL: "http://localhost:8017",
//     withCredentials:true
// })
import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8017',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
})

axiosInstance.interceptors.request.use((config) => {
  if (!config.url.includes('/login') && !config.url.includes('/register')) {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Response received:', response.status); 
        return response;
    },
    (error) => {
        if (error.response) {
            console.error('Response Error:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }
        return Promise.reject(error);
    }
);
