// import axios from "axios";

// export const axiosInstance = axios.create({
//     baseURL: "http://localhost:8017",
//     withCredentials:true
// })


import axios from "axios";

const baseURL = import.meta.env.PROD 
    ? "https://cdcs-be1.onrender.com"
    : "http://localhost:8017";

export const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error('Response Error:', error.response.data);
        } else if (error.request) {
            console.error('Request Error:', error.request);
        } else {
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);
