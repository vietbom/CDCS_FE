import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://cdcs-be-1.onrender.com",
    withCredentials:true
})