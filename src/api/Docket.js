import { create } from "zustand"
import { axiosInstance } from "../lib/axios"

export const useDocketStore = create((set) => ({
  dockets: [],

  createDocket: async (newDocket) => {
    try {
      const res = await axiosInstance.post('/docket/creatDocket', newDocket)
      const data = res.data?.data

      set((state) => ({
        dockets: [...state.dockets, data]
      }))

      return res.data
    } catch (error) {
      console.log("createdocket error response: ", error.response)
      return null
    }
  },

  findDocket: async(searchText) => {
    try {
      const res = await axiosInstance.post('/docket/findDocket', {infoDocket: searchText})
      const foundDockets = res.data || []
      set({dockets: foundDockets})
      return foundDockets
    } catch (error) {
      console.error('Lỗi tìm kiếm phiếu mượn sinh viên:', error)
      set({ dockets: [] })
      return []
    }
  },

  getDockets: async() => {
    try {
      const res = await axiosInstance.get('/docket/getDocket')
      set({dockets: res.data?.data || []})
      return res.data
    } catch (error) {
      console.error("Error fetching dockets:", error)
      set({ dockets: []})
      return null
    }
  },

  returnBook: async (docketId, bookId, actualReturnDate = new Date()) => {
    try {
      const res = await axiosInstance.post(`/docket/returnBook/${docketId}`, {
        booksReturn: [{ IdBook: bookId }],
        ngayTra: actualReturnDate
      });

      return res.data;
    } catch (error) {
      console.error('Lỗi khi trả sách:', error);
      return null;
    }
  },


  getBorrowedBooks: async (MaSV) => {
    try {
      const response = await axiosInstance.get('/docket/getBorrowedBooks', {
        params: { MaSV: MaSV },
      })
      set({ dockets: response.data })
    } catch (error) {
      console.error('Error fetching borrowed books:', error)
    }
  },
}))

