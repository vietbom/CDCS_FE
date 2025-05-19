import {create} from 'zustand'
import { axiosInstance } from '../lib/axios.js'

export const adminStore = create((set) =>({
    authAdmin: null,
    isStudenLogin: false,
    isCheckAdminAuth: true,
    students: [],

    checkAdminAuth: async() => {
        try {
            const res = await axiosInstance.get('/api/admin/check')
            console.log('FE: checkAuth thành công', res.data)
            set({authAdmin: res.data})
        } catch (error) {
            console.log('Error in checkAuth:', error)
            set({ authAdmin: null })
        }finally{
            set({isCheckAdminAuth: false})
        }
    },
    signUp: async(data)=>{
        try {
            const res = await axiosInstance.post('/api/admin/signUp', data)
            return res.data
        } catch (error) {
            console.error('SignUp error:', error)
            console.error('SignUp error response:', error.response)
            return null
        }
    },

    adminLogin: async (data) => {
        set({ isLogin: true })
        try {
            const res = await axiosInstance.post('/api/admin/login', data)
            set({ authAdmin: res.data })
            return res.data
        } catch (error) {
            console.error('Login error:', error)
            console.error('Login error response:', error.response) 
            return null
        } finally {
            set({ isLogin: false })
        }
    },
    adminLogout: async() =>{
        try {
            await axiosInstance.post('/api/admin/logout')
            set({ authAdmin: null })
        } catch (error) {
            console.error('Login error response:', error.response) 
        }
    },
    getStudent: async() =>{
        try {
            const res = await axiosInstance.get('/api/admin/getStudent')
            set({students: res.data})
            return res.data
        } catch (error) {
            console.error('Error fetching Students', error)
            set({students: []})
            return null
        }
    },
    findStudent: async(searchText)=>{
        try {
            const res = await axiosInstance.post('/api/admin/findStudent', {infoUser: searchText})
            return res.data
        } catch (error) {
            console.error('lỗi tìm kiếm sinh viên ', error)
        }
    },
    updateStudent: async (selectedStudent) => {
        try {
            const { _id, MaSV, userName, classroom, email, SDT } = selectedStudent
            const res = await axiosInstance.post(`/api/admin/updateStudent/${_id}`, {
            MaSV,
            userName,
            classroom,
            email,
            SDT,
            })

            const updated = res.data?.student

            if (updated) {
            set((state) => ({
                students: state.students.map((student) =>
                student._id === updated._id ? updated : student
                ),
            }))
            return updated
            } else {
            console.warn("No student returned from update")
            return null
            }
        } catch (error) {
            console.error("Error in updating student:", error)
            return null
        }
    },

    deleteStudent: async(_id) => {
        try {
            axiosInstance.delete(`/api/admin/delStudent/${_id}`)
            set((state) => ({
                students: state.students.filter((student) => student._id !== _id)
            }))
        } catch (error) {
            console.error("Error in deleting Student ", error)
            return null
        }
    },
    addStudent: async(newStudent) => {
        try {
            const res = await axiosInstance.post('/api/admin/addStudent', newStudent)
            set((state) =>({students: [...state.students, res.data]}))
            return res.data
        } catch (error) {
            console.log("AddStudent error response: ", error.response)
            return null
        }
    }
}))