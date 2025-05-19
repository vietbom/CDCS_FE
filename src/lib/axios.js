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
    withCredentials: true
})
