import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'

export const studentStore = create((set) => ({
    authUser: null,
    isStudentLogin: false,
    isCheckStudentAuth: true,
    error: null,

    checkStudentAuth: async () => {
        try {
            const res = await axiosInstance.get('/student/check')
            console.log('FE: checkAuth thành công', res.data)
            set({ authUser: res.data })
            return res.data
        } catch (error) {
            console.error('Error in checkAuth:', error)
            set({ authUser: null, error: error.response?.data?.message || error.message })
            throw error
        } finally {
            set({ isCheckStudentAuth: false })
        }
    },

    signUp: async (data) => {
        try {
            const res = await axiosInstance.post('/student/signUp', data)
            return res.data
        } catch (error) {
            console.error('SignUp error:', error)
            return null
        }
    },

    login: async (data) => {
        set({ isStudentLogin: true, error: null })
        try {
            const res = await axiosInstance.post('/student/login', data)
            set({ authUser: res.data, error: null })
            return res.data
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Đăng nhập thất bại'
            set({ error: errorMsg })
            throw new Error(errorMsg)
        } finally {
            set({ isStudentLogin: false })
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/student/logout')
            set({ authUser: null })
        } catch (error) {
            console.error('Logout error:', error)
        }
    },
}))
