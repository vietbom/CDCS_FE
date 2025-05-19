// import axios from "axios";

// export const axiosInstance = axios.create({
//     baseURL: "http://localhost:8017",
//     withCredentials:true
// })


import axios from "axios";

const baseURL = import.meta.env.PROD 
    ? "https://cdcs-be1.onrender.com"
    : "http://localhost:8017";

console.log('Current API URL:', baseURL); // Debug log

export const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 15000, // Increased timeout
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        console.log('Making request to:', config.url); // Debug log
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Response received:', response.status); // Debug log
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
